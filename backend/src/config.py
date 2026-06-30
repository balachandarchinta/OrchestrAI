import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    db_path: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "db.json"))

settings = Settings()
