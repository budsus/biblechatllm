from openai import OpenAI
from config import settings
from ner_prompt import NER_PROMPT
import json

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def analyze_question(question: str):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You are a biblical NER extraction system."},
            {"role": "user", "content": NER_PROMPT + question}
        ]
    )

    content = response.choices[0].message.content
    return json.loads(content) # type: ignore
