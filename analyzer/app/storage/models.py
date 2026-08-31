import json
from typing import Optional, List, Dict, Any
from .database import get_db_connection

def save_analysis(result: Dict[str, Any]) -> str:
    conn = get_db_connection()
    cursor = conn.cursor()

    analysis_id = result.get("id")
    timestamp = result.get("timestamp", "")
    filename = result.get("captureInfo", {}).get("filename", "unknown.pcap")
    result_json = json.dumps(result)
    security_score = result.get("scores", {}).get("securityScore", 0)
    risk_level = result.get("scores", {}).get("riskLevel", "UNKNOWN")
    vpn_type = f"{result.get('vpnDetection', {}).get('protocol', 'IPsec')} {result.get('vpnDetection', {}).get('ikeVersion', '')}".strip()

    # Save to analyses table
    cursor.execute('''
        INSERT OR REPLACE INTO analyses (id, timestamp, filename, result_json, security_score, risk_level)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (analysis_id, timestamp, filename, result_json, security_score, risk_level))

    # Save to history table
    cursor.execute('''
        INSERT OR REPLACE INTO history (id, timestamp, source, vpn_type, security_score, risk_level, status)
        VALUES (?, ?, ?, ?, ?, ?, 'COMPLETED')
    ''', (analysis_id, timestamp, filename, vpn_type, security_score, risk_level))

    conn.commit()
    conn.close()
    return analysis_id

def get_analysis_by_id(analysis_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT result_json FROM analyses WHERE id = ?', (analysis_id,))
    row = cursor.fetchone()
    conn.close()

    if row:
        return json.loads(row['result_json'])
    return None

def get_all_history() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id, timestamp, source, vpn_type as vpnType, security_score as securityScore, risk_level as riskLevel, status FROM history ORDER BY timestamp DESC')
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]
