from database import Base
from sqlalchemy import (
    Column,
    Text,
    Integer,
    Boolean,
    Float,
    ForeignKey
)

class Person(Base):
    __tablename__ = "people"

    # Primary Key
    personlookup = Column(Text, primary_key=True)

    # Basic Info
    status = Column(Text)
    personid = Column(Text)
    displaytitle = Column(Text)
    name = Column(Text)
    surname = Column(Text)
    alsocalled = Column(Text)

    # Flags
    ispropername = Column(Boolean)
    ambiguous = Column(Boolean)

    # Disambiguation
    disambiguationtemp = Column(Text)

    # Demographics
    gender = Column(Text)
    occupations = Column(Text)

    birthyear = Column(Integer)
    minyear = Column(Integer)
    deathyear = Column(Integer)
    maxyear = Column(Integer)

    birthplace = Column(Text)
    deathplace = Column(Text)

    memberof = Column(Text)

    # Dictionary Content
    eastons = Column(Text)
    dicttext = Column(Text)

    # Events
    events = Column(Text)
    eventgroups = Column(Text)

    versecount = Column(Integer)
    verses = Column(Text)

    # Family
    mother = Column(Text)
    father = Column(Text)
    partners = Column(Text)
    children = Column(Text)
    siblings = Column(Text)
    halfsiblingssamemother = Column(Text)
    halfsiblingssamefather = Column(Text)

    # Writing
    chapterswritten = Column(Text)

    # Metadata
    alphagroup = Column(Text)
    slug = Column(Text)
    modified = Column(Text)

class Place(Base):
    __tablename__ = "places"

    # Primary Key
    placelookup = Column(Text, primary_key=True)

    # Basic Info
    status = Column(Text)
    displaytitle = Column(Text)
    ambiguous = Column(Boolean)
    duplicate_of = Column(Text)
    placeid = Column(Text)

    # Names
    kjvname = Column(Text)
    esvname = Column(Text)
    aliases = Column(Text)

    # Classification
    featuretype = Column(Text)
    featuresubtype = Column(Text)

    # Coordinates
    openbiblelat = Column(Float)
    openbiblelong = Column(Float)

    latitude = Column(Float)
    longitude = Column(Float)

    # Metadata
    rootid = Column(Text)
    precision = Column(Text)
    comment = Column(Text)

    # Biblical References
    verses = Column(Text)
    versecount = Column(Integer)

    eastons = Column(Text)
    dicttext = Column(Text)

    # Recogito Data
    recogitouri = Column(Text)
    recogitolat = Column(Float)
    recogitolon = Column(Float)
    recogitocomments = Column(Text)
    recogitostatus = Column(Text)
    recogitotype = Column(Text)
    recogitolabel = Column(Text)
    recogitouid = Column(Text)

    # People & Events
    peopleborn = Column(Text)
    peopledied = Column(Text)
    bookswritten = Column(Text)
    eventshere = Column(Text)
    hasbeenhere = Column(Text)

    # Other
    alphagroup = Column(Text)
    slug = Column(Text)

class Event(Base):
    __tablename__ = "events"

    eventid = Column(Text, primary_key=True)

    title = Column(Text)
    startdate = Column(Text)
    duration = Column(Text)

    predecessor = Column(Text)
    lag = Column(Text)
    lagtype = Column(Text)

    partof = Column(Text)

    verses = Column(Text)
    participants = Column(Text)
    locations = Column(Text)
    groups = Column(Text)

    notes = Column(Text)

    versesort = Column(Text)
    modified = Column(Text)
    sortkey = Column(Text)


class Verse(Base):
    __tablename__ = "verses"

    osisref = Column(Text, primary_key=True)

    status = Column(Text)
    verseid = Column(Text)

    book = Column(Text, ForeignKey("books.book"))
    chapter = Column(Text, ForeignKey("chapters.chapter"))

    versenum = Column(Integer)

    versetext = Column(Text)
    richtext = Column(Text)
    mdtext = Column(Text)

    people = Column(Text)
    peoplecount = Column(Integer)

    places = Column(Text)
    placescount = Column(Integer)

    yearnum = Column(Integer)

    peoplegroups = Column(Text)
    event = Column(Text)

    modified = Column(Text)
