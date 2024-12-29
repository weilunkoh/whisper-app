import pytest
import src.helper_time as helper_time


def test_get_timestamp_ms():
    assert type(helper_time.get_timestamp_ms()) == int
