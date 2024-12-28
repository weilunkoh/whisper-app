import requests
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()


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


def call_custom_endpoint(user_prompt: str, system_prompt: str = ""):
    url = "http://localhost:5000/api/postprocess"
    payload = {
        "user_prompt": user_prompt,
        "system_prompt": system_prompt,
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.iter_lines(decode_unicode=True)


if __name__ == "__main__":
    user_prompt = "What is the meaning of life? Give me 3 paragraphs."
    system_prompt = "Answer like yoda."

    # for chunk in complete_chat(user_prompt, system_prompt):
    #    print(chunk, end="")

    count = 1
    for chunk in call_custom_endpoint(user_prompt, system_prompt):
        # print(chunk, end="")
        print(f"Chunk {count}: {chunk}")
        count += 1
