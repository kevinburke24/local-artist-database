
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from backend.db.database import Base

class SearchLog(Base):
    __tablename__ = "search_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=func.now())
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    stage_name = Column(String, nullable=True)
    genre = Column(String, nullable=True)
    zip_code = Column(String, nullable=True)
    neighborhood = Column(String, nullable=True)
    min_listeners = Column(Integer, nullable=True)
    max_listeners = Column(Integer, nullable=True)
    page = Column(Integer)
    limit = Column(Integer)