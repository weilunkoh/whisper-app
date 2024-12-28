import logging
from io import BytesIO
from typing import Union
from zipfile import ZipFile

from sqlalchemy import (
    Column,
    Integer,
    MetaData,
    String,
    Table,
    create_engine,
    func,
    insert,
    select,
    update,
)
from src.helper_time import get_timestamp_ms
from transformers import pipeline


def get_engine(db_name: str):
    if db_name == "":
        return create_engine("sqlite://")
    return create_engine(f"sqlite:///{db_name}")


def get_table(engine) -> Table:
    metadata_obj = MetaData()
    table = Table(
        "transcription",
        metadata_obj,
        Column("id", Integer, primary_key=True),
        Column("filename", String),
        Column("transcribed_text", String),
        Column("upload_timestamp", Integer),
        Column("status", String, server_default="In Progress"),
        Column("transcription_timestamp", Integer),
    )
    return table


def insert_new_task(
    engine,
    table: Table,
    model: pipeline,
    filename: str,
    timestamp: int,
) -> int:
    try:
        conn = engine.connect()
        ins_stmt = insert(table).values(
            filename=filename,
            upload_timestamp=timestamp,
        )
        with engine.connect() as conn:
            result = conn.execute(ins_stmt)
            conn.commit()
        return result.inserted_primary_key[0]
    except Exception as e:
        logging.info(f"Error with db insert => {e}")
        return -1


def transcribe_and_update(
    engine,
    table: Table,
    model: pipeline,
    audio_bytes: bytes,
    id: int,
) -> bool:
    try:
        transcription = model(audio_bytes)
        transcribed_text = transcription["text"]
    except Exception as e:
        logging.info(f"Error with transcribe => {e}")
        transcribed_text = "Error transcribing audio"

    try:
        conn = engine.connect()
        upd_stmt = (
            update(table)
            .where(table.c.id == id)
            .values(
                transcribed_text=transcribed_text,
                status="Completed",
                transcription_timestamp=get_timestamp_ms(),
            )
        )
        with engine.connect() as conn:
            result = conn.execute(upd_stmt)
            conn.commit()
        return True
    except Exception as e:
        logging.info(f"Error with db update => {e}")
        upd_stmt = (
            update(table)
            .where(table.c.id == id)
            .values(
                status="Error",
                transcription_timestamp=get_timestamp_ms(),
            )
        )
        with engine.connect() as conn:
            result = conn.execute(upd_stmt)
            conn.commit()
        return False


def execute_one_task(
    engine,
    table: Table,
    model: pipeline,
    filename: str,
    timestamp: int,
    audio_bytes: bytes,
):
    task_id = insert_new_task(engine, table, model, filename, timestamp)
    if task_id == -1:
        return False
    return transcribe_and_update(engine, table, model, audio_bytes, task_id)


def execute_batch_task(
    engine,
    table: Table,
    model: pipeline,
    filename: str,
    timestamp: int,
    zip_bytes: bytes,
):
    try:
        with ZipFile(BytesIO(zip_bytes)) as zip_file:
            task_ids = []
            zip_filenames = zip_file.namelist()
            for audio_filename in zip_filenames:
                task_id = insert_new_task(
                    engine, table, model, f"{filename}/{audio_filename}", timestamp
                )
                if task_id == -1:
                    logging.info(f"Error inserting task for {audio_filename}")
                    return False
                task_ids.append(task_id)

            for audio_filename, task_id in zip(zip_filenames, task_ids):
                audio_bytes = zip_file.read(audio_filename)
                transcribe_and_update(engine, table, model, audio_bytes, task_id)
        return True
    except Exception as e:
        logging.info(str(e))
        return False


def find_records(
    engine,
    table: Table,
    limit: int,
    offset: int,
    filtered_term: Union[str | None] = None,
):
    with engine.connect() as conn:
        if filtered_term is None:
            sel_stmt = select(table).limit(limit).offset(offset)
            count_stmt = select(func.count(table.c.id))
        else:
            sel_stmt = (
                select(table)
                .limit(limit)
                .offset(offset)
                .filter(table.c.filename.contains(filtered_term))
            )
            count_stmt = select(func.count(table.c.id)).filter(
                table.c.filename.contains(filtered_term)
            )

        result = conn.execute(sel_stmt)
        result_list = [dict(record) for record in result.mappings().all()]
        num_records = conn.execute(count_stmt).scalar()

        return result_list, num_records
