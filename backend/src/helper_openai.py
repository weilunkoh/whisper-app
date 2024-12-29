import logging

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
try:
    client = OpenAI()
except Exception as e:
    logging.error(f"Error with OpenAI client => {e}")
    logging.info("Postprocessing beta feature via OpenAI is not available")
    client = None


def complete_chat(user_prompt: str, system_prompt: str = ""):
    if system_prompt != "":
        messages = [
            {
                "role": "system",
                "content": system_prompt,
            },
        ]
    else:
        messages = []
    messages.append(
        {
            "role": "user",
            "content": user_prompt,
        }
    )
    stream = client.chat.completions.create(
        messages=messages,
        model="gpt-4o-mini",
        temperature=0,
        stream=True,
    )
    for chunk in stream:
        yield_chunk = chunk.choices[0].delta.content or ""
        yield yield_chunk
