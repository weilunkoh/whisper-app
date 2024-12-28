from flask_restx import Api, reqparse
from werkzeug.datastructures import FileStorage

transcribe_parser = reqparse.RequestParser()
transcribe_parser.add_argument(
    "uploaded_file", type=FileStorage, location="files", required=True
)


transcriptions_parser = reqparse.RequestParser()
transcriptions_parser.add_argument("limit", type=int, required=True)
transcriptions_parser.add_argument("offset", type=int, required=True)

search_parser = reqparse.RequestParser()
search_parser.add_argument("limit", type=int, required=True)
search_parser.add_argument("offset", type=int, required=True)
search_parser.add_argument("filtered_term", type=str, required=True)
