"""
Base model definitions.
Contains the base class for all SQLAlchemy models.
"""

from sqlalchemy.ext.declarative import declarative_base

# Create the declarative base for all models
Base = declarative_base()
