"""
Question database model.
SQLAlchemy ORM model for question entities in the classroom Q&A application.
"""

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from typing import Optional
from .base import Base
from ...utils.timezone import now_israel


class Question(Base):
    """
    SQLAlchemy model for questions table.
    
    Represents a question in the classroom Q&A system.
    """
    
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(Text, nullable=False, index=True)
    text = Column(Text, nullable=False)
    access_code = Column(String, nullable=False, unique=True, index=True)
    is_closed = Column(Integer, nullable=False, default=0)  # 0 = False/Open, 1 = True/Closed
    created_at = Column(DateTime, nullable=False, default=now_israel)
    close_date = Column(DateTime, nullable=True, default=None)
    
    def __repr__(self):
        return f"<Question(id={self.id}, title='{self.title}', access_code='{self.access_code}', is_closed={self.is_closed}, close_date={self.close_date})>"
