from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from config import settings
from database import get_db
import crud
import sys
from openai_service import analyze_question
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def check_openai_config():
    print("Checking OpenAI configuration...")

    if not settings.OPENAI_API_KEY:
        print("❌ OPENAI_API_KEY is NOT set")
        sys.exit(1)

    if not settings.OPENAI_API_KEY.startswith("sk-"):
        print("❌ OPENAI_API_KEY format looks wrong")
        sys.exit(1)

    print("✅ OPENAI_API_KEY is set")

@app.get("/health/openai")
def openai_health():
    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        client.models.list()
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

class QuestionRequest(BaseModel):
    question: str

def parse_osis(osis: str):
    """
    Convert OSIS format like:
    John.3.16 -> ("John", 3, 16)
    """
    if not osis:
        return None

    parts = osis.split(".")
    if len(parts) != 3:
        return None

    book = parts[0]
    chapter = int(parts[1])
    verse = int(parts[2])

    return book, chapter, verse

@app.post("/ask")
def ask_question(req: QuestionRequest, db: Session = Depends(get_db)):

    analysis = analyze_question(req.question)

    entities = analysis.get("entities", [])
    summary = analysis.get("summary", "")

    db_results = {}

    for entity in entities:
        name = entity.get("name")
        etype = entity.get("type")
        osis = entity.get("osis")

        if etype == "people":
            person = crud.get_person_by_key(db, name)
            db_results[name] = person

        elif etype == "place":
            place = crud.get_place_by_key(db, name)
            db_results[name] = place

        elif etype == "event":
            event = crud.search_event(db, name)
            db_results[name] = event

        elif etype == "verse" and osis:
            parsed = parse_osis(osis)

            if parsed:
                book, chapter, verse = parsed
                verse_data = crud.get_verse(db, book, chapter, verse)
                db_results[osis] = verse_data
            else:
                db_results[osis] = None

    return {
        "summary": summary,
        "entities": entities,
        "database_details": db_results
    }
