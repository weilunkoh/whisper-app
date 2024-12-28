import logging
from os import getenv as os_getenv
from threading import Thread

from dotenv import load_dotenv
from flask import Flask, Response, send_file
from flask_restx import Api, Resource
from src.helper_hf import load_model_pipeline
from src.helper_openai import complete_chat
from src.helper_parser import (
    postprocess_parser,
    search_parser,
    transcribe_parser,
    transcriptions_parser,
)
from src.helper_sqlite import (
    execute_batch_task,
    execute_one_task,
    find_records,
    get_engine,
    get_table,
)
from src.helper_time import get_timestamp_ms

load_dotenv()

logging.basicConfig(level=logging.INFO)

app: Flask = Flask(__name__)
app.model = load_model_pipeline()
app.sqlite_engine = get_engine(os_getenv("DB_NAME", ""))
app.sqlite_table = get_table(app.sqlite_engine)
app.config.SWAGGER_UI_DOC_EXPANSION = "list"

api = Api(
    app,
    version="1.0",
    title="REST APIs for Speech-to-text Web Application",
    description="Documentation and quick testing page for REST APIs.",
    prefix="/api",
)

if os_getenv("MODE", "prod") == "dev":
    from flask_cors import CORS

    CORS(app)


@api.route("/health", methods=["GET"])
@api.doc(
    description="For checking status of REST APIs application", responses={200: "OK"}
)
class HealthCheck(Resource):
    def get(self):
        return {"status": "healthy"}, 200


@api.route("/transcribe", methods=["POST"])
@api.doc(
    description="For transcribing .mp3 audio files or a zip of .mp3 audio files to text",
    responses={
        200: "OK",
        400: "Bad Request (e.g. invalid file format)",
        500: "Internal Server Error",
    },
)
class Transcribe(Resource):
    @api.expect(transcribe_parser)
    def post(self):
        args = transcribe_parser.parse_args()
        uploaded_file = args["uploaded_file"]
        if not uploaded_file.filename.lower().endswith(
            ".mp3"
        ) and not uploaded_file.filename.lower().endswith(".zip"):
            return {"message": "Only .mp3 and .zip files are supported"}, 400

        try:
            timestamp = get_timestamp_ms()
            filename = uploaded_file.filename
            if uploaded_file.filename.lower().endswith(".mp3"):
                audio_bytes = uploaded_file.read()

                Thread(
                    target=execute_one_task,
                    args=(
                        app.sqlite_engine,
                        app.sqlite_table,
                        app.model,
                        filename,
                        timestamp,
                        audio_bytes,
                    ),
                ).start()
            else:
                zip_bytes = uploaded_file.read()

                Thread(
                    target=execute_batch_task,
                    args=(
                        app.sqlite_engine,
                        app.sqlite_table,
                        app.model,
                        filename,
                        timestamp,
                        zip_bytes,
                    ),
                ).start()
            return {
                "status": "success",
                "result": f"Started transcription task for {filename} successfully.",
            }, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500


@api.route("/transcriptions", methods=["GET"])
@api.doc(description="For getting a list of transcriptions", responses={200: "OK"})
class Transcriptions(Resource):
    @api.expect(transcriptions_parser)
    def get(self):
        args = transcriptions_parser.parse_args()
        limit = args["limit"]
        offset = args["offset"]

        if limit < 1 or offset < 0:
            return {"status": "error", "message": "Invalid limit or offset value"}, 400

        try:
            result, num_records = find_records(
                app.sqlite_engine, app.sqlite_table, limit, offset
            )
            return {
                "status": "success",
                "total_num_records": num_records,
                "result": result,
            }, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500


@api.route("/search", methods=["GET"])
@api.doc(
    description="For getting a list of transcriptions with the filtered search terms",
    responses={200: "OK"},
)
class Search(Resource):
    @api.expect(search_parser)
    def get(self):
        args = search_parser.parse_args()
        limit = args["limit"]
        offset = args["offset"]
        filtered_term = args["filtered_term"]

        if limit < 1 or offset < 0:
            return {"status": "error", "message": "Invalid limit or offset value"}, 400

        try:
            result, num_records = find_records(
                app.sqlite_engine, app.sqlite_table, limit, offset, filtered_term
            )
            return {
                "status": "success",
                "total_num_records": num_records,
                "result": result,
            }, 200
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500


@api.route("/postprocess", methods=["POST"])
@api.doc(
    description="For postprocessing transcribed text using OpenAI's gpt-4o-mini model",
    responses={
        200: "OK",
        400: "Bad Request (e.g. missing user prompt)",
        500: "Internal Server Error",
    },
)
class Postprocess(Resource):
    @api.expect(postprocess_parser)
    def post(self):
        args = postprocess_parser.parse_args()
        user_prompt = args["user_prompt"]
        system_prompt = args["system_prompt"]

        if system_prompt is None:
            system_prompt = ""

        try:
            return Response(
                complete_chat(user_prompt, system_prompt),
                mimetype="text/plain",
                status=200,
            )
        except Exception as e:
            return {"status": "error", "message": str(e)}, 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
