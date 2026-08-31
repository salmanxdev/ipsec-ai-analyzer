import sqlite3
import json
import os
from typing import Optional, List, Dict, Any

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'ipsec_analyzer.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Table for storing full analysis results
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            timestamp TEXT NOT NULL,
            filename TEXT,
            result_json TEXT NOT NULL,
            security_score INTEGER,
            risk_level TEXT
        )
    ''')

    # Table for session history
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS history (
            id TEXT PRIMARY KEY,
            timestamp TEXT NOT NULL,
            source TEXT NOT NULL,
            vpn_type TEXT NOT NULL,
            security_score INTEGER NOT NULL,
            risk_level TEXT NOT NULL,
            status TEXT DEFAULT 'COMPLETED'
        )
    ''')

    # Table for generated report files
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id TEXT PRIMARY KEY,
            analysis_id TEXT NOT NULL,
            report_type TEXT NOT NULL,
            file_path TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')

    conn.commit()
    conn.close()

# Auto-initialize database on import
init_db()
