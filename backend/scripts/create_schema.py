import logging

from sqlalchemy import Column, Integer, MetaData, String, Table, create_engine

logging.basicConfig(
    format="[%(asctime)s] %(levelname)s: %(message)s",
    level=logging.INFO,
)


def create_db():
    """
    Deletes the existing database and creates a new one.
    """
    db_name = "db_initial.db"
    db_file = open(db_name, "w")  # create a new file or overwrite the existing one
    db_file.close()
    engine = create_engine(f"sqlite:///{db_name}")
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
    metadata_obj.create_all(engine)
    logging.info(f"Database {db_name} created successfully")


if __name__ == "__main__":
    # e.g. python -m scripts.create_schema
    create_db()
