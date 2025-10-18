"""
Answer database model.
SQLAlchemy ORM model for answer entities in the classroom Q&A application.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from .base import Base
from ...utils.timezone import now_israel


class Answer(Base):
    """
    SQLAlchemy model for answers table.
    
    Represents an answer to a question in the classroom Q&A system.
    Enforces one answer per student per question constraint.
    """
    
    __tablename__ = "answers"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False, index=True)
    student_id = Column(String, nullable=False, index=True)  # References external JSON list
    text = Column(String(200), nullable=False)  # Max 200 characters
    timestamp = Column(DateTime, nullable=False, default=now_israel, index=True)
    
    # Composite unique constraint: one answer per student per question
    __table_args__ = (
        UniqueConstraint('question_id', 'student_id', name='uq_question_student'),
    )
    
    def __repr__(self):
        return f"<Answer(id={self.id}, question_id={self.question_id}, student_id='{self.student_id}', timestamp='{self.timestamp}')>"
