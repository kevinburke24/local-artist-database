import secrets
import hashlib

def generate_token() -> tuple[str, str]:
    raw = secrets.token_urlsafe(32)
    print("DEV VERIFY TOKEN:", raw)
    hashed = hashlib.sha256(raw.encode()).hexdigest()
    return raw, hashed

def hash_token(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()