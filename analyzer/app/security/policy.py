# Security policy configuration for IPsec AI Analyzer

DEFAULT_SECURITY_POLICY = {
    "min_dh_group_bits": 2048,
    "recommended_dh_group_bits": 3072,
    "allowed_encryption": ["AES-CBC-128", "AES-CBC-256", "AES-GCM-128", "AES-GCM-256"],
    "forbidden_encryption": ["DES", "3DES", "NULL", "RC4"],
    "allowed_integrity": ["HMAC-SHA256", "HMAC-SHA384", "HMAC-SHA512", "AEAD"],
    "forbidden_integrity": ["MD5", "SHA1"],
    "require_pfs": True,
    "require_replay_protection": True,
    "min_replay_window_bits": 64,
    "max_ike_sa_lifetime_sec": 86400,
    "max_child_sa_lifetime_sec": 28800
}
