from sqlalchemy.orm import Session
from sqlalchemy import select, func, desc, text
from models import Person, Place, Event, Verse
import re

def get_person_by_key(db: Session, key: str):
    stmt = (
        select(Person)
        .where(
            func.lower(Person.name).ilike(func.lower(f"%{key}%")) |
            func.lower(Person.displaytitle).ilike(func.lower(f"%{key}%")) |
            func.lower(Person.alsocalled).ilike(func.lower(f"%{key}%"))
        )
        .order_by(desc(Person.versecount).nullslast())
        .limit(1)
    )

    result = db.execute(stmt).scalars().first()

    return result.__dict__ if result else None

def get_place_by_key(db: Session, key: str):
    key = (key or "").strip()

    if not key:
        return None

    q = text("""
        SELECT *
        FROM places
        WHERE lower(displaytitle) = lower(:k)
        LIMIT 1
    """)

    row = db.execute(q, {"k": key}).mappings().first()

    return dict(row) if row else None

EVENT_FTS_MUST_SHOULD_SQL = text("""
  WITH q AS (
    SELECT
      to_tsvector('english', coalesce(title,'') || ' ' || coalesce(notes,'')) AS tsv,
      eventid, title, startdate, duration, predecessor, partof,
      verses, participants, locations, groups
    FROM events
  )
  SELECT
    eventid, title, startdate, duration, predecessor, partof,
    verses, participants, locations, groups,
    ts_rank_cd(
      tsv,
      to_tsquery('english', :tsq)
    ) AS rank
  FROM q
  WHERE tsv @@ to_tsquery('english', :tsq)
  ORDER BY rank DESC
  LIMIT :k
""")


def keywords(text: str):
    # Simple tokenizer
    tokens = re.findall(r"[a-zA-Z0-9]+", text.lower())
    return list(set(tokens))


def pick_anchor(tokens):
    # Strategy: token terpanjang
    if not tokens:
        return None
    return max(tokens, key=len)


def build_tsquery_must_should(event_text: str) -> str:
    ks = keywords(event_text)
    anchor = pick_anchor(ks)

    if not anchor:
        return ""

    others = [k for k in ks if k != anchor]

    if not others:
        return anchor

    should = " | ".join(others)

    # MUST anchor + SHOULD others
    return f"{anchor} & ({should})"

def search_event(db: Session, event_text: str, k: int = 10):
    event_text = (event_text or "").strip()

    if not event_text:
        return None

    tsq = build_tsquery_must_should(event_text)

    if not tsq:
        return None

    rows = db.execute(
        EVENT_FTS_MUST_SHOULD_SQL,
        {"tsq": tsq, "k": k}
    ).mappings().all()

    return dict(rows[0]) if rows else None

def get_verse(db: Session, book: str, chapter: int, verse: int):
    query = text("""
      SELECT
        osisref AS "osisRef",
        status,
        verseid AS "verseID",
        book,
        chapter,
        versenum AS "verseNum",
        versetext AS "verseText",
        richtext AS "richText",
        mdtext AS "mdText",
        people,
        peoplecount AS "peopleCount",
        places,
        placescount AS "placesCount",
        yearnum AS "yearNum",
        peoplegroups AS "peopleGroups",
        event,
        modified
      FROM verses
      WHERE lower(book)=lower(:book)
          AND regexp_replace(chapter, '.*\\.(\\d+)$', '\\1')::int = :chapter
          AND versenum = :verse
    """)

    result = db.execute(
        query,
        {
            "book": book,
            "chapter": chapter,
            "verse": verse
        },
    ).mappings().first()

    return dict(result) if result else None
