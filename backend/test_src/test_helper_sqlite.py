import pytest
import src.helper_sqlite as helper_sqlite


def test_get_table():
    table = helper_sqlite.get_table(helper_sqlite.get_engine(""))
    assert table.name == "transcription"
    assert len(table.columns) == 6
    assert table.columns[0].name == "id"
    assert table.columns[1].name == "filename"
    assert table.columns[2].name == "transcribed_text"
    assert table.columns[3].name == "upload_timestamp"
    assert table.columns[4].name == "status"
    assert table.columns[5].name == "transcription_timestamp"
