-- SQLite Table Creation Statements for Classroom Q&A Application
-- Generated from SQLAlchemy models

-- Table 1: Questions
CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    text TEXT NOT NULL,
    access_code TEXT NOT NULL UNIQUE,
    is_closed INTEGER NOT NULL DEFAULT 0
);

-- Create index on title for better query performance
CREATE INDEX ix_questions_title ON questions (title);

-- Create index on access_code for better query performance
CREATE INDEX ix_questions_access_code ON questions (access_code);

-- Table 2: Answers
CREATE TABLE answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    student_id TEXT NOT NULL,
    text VARCHAR(200) NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create foreign key constraint
CREATE INDEX ix_answers_question_id ON answers (question_id);

-- Create index on student_id for better query performance
CREATE INDEX ix_answers_student_id ON answers (student_id);

-- Create index on timestamp for better query performance
CREATE INDEX ix_answers_timestamp ON answers (timestamp);

-- Create composite unique constraint: one answer per student per question
CREATE UNIQUE INDEX uq_question_student ON answers (question_id, student_id);

-- Optional: Add foreign key constraint (SQLite supports this but it's disabled by default)
-- To enable foreign key constraints in SQLite, run: PRAGMA foreign_keys = ON;
-- FOREIGN KEY (question_id) REFERENCES questions(id)
