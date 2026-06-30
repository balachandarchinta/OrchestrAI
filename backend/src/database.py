import json
import os
from .config import settings

def load_db():
    if not os.path.exists(settings.db_path):
        return {"workspaces": []}
    with open(settings.db_path, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {"workspaces": []}

def save_db(data):
    os.makedirs(os.path.dirname(settings.db_path), exist_ok=True)
    with open(settings.db_path, "w") as f:
        json.dump(data, f, indent=4)
