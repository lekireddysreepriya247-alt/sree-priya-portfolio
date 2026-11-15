"""
Python backend for the portfolio (Flask).

  POST /api/contact   -> checks the contact form and saves the message
  POST /api/visits    -> adds 1 to the visitor counter and returns it
  GET  /api/visits    -> returns the visitor counter
  GET  /api/messages  -> lists saved messages (needs ?key=ADMIN_KEY)
  GET  /api/health    -> shows that the backend is running and where it stores data

Storage:
  If the MONGODB_URI environment variable is set, data is stored in MongoDB Atlas
  (permanent). If it is not set, data goes to a small JSON file, which is fine on
  your own computer but is temporary on Vercel.

Run on your computer:   pip install -r requirements.txt   then   python api/index.py
"""
import json
import os
import re
import tempfile
import threading
from datetime import datetime, timezone

from flask import Flask, jsonify, request, send_from_directory

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]{2,}$")

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024  # nobody needs to send more than 16 KB


# ---------------------------------------------------------------- storage
class MongoStore:
    name = "mongodb"

    def __init__(self, uri):
        from pymongo import MongoClient
        self.db = MongoClient(uri, serverSelectionTimeoutMS=5000)[os.environ.get("MONGODB_DB", "portfolio")]

    def add_message(self, doc):
        self.db.messages.insert_one(dict(doc))

    def list_messages(self):
        return list(self.db.messages.find({}, {"_id": 0}).sort("sent_at", -1).limit(200))

    def get_visits(self):
        row = self.db.counters.find_one({"_id": "visits"})
        return int(row["count"]) if row else 0

    def add_visit(self):
        from pymongo import ReturnDocument
        row = self.db.counters.find_one_and_update(
            {"_id": "visits"}, {"$inc": {"count": 1}}, upsert=True, return_document=ReturnDocument.AFTER
        )
        return int(row["count"])


class FileStore:
    name = "file (temporary)"
    lock = threading.Lock()

    def __init__(self):
        self.path = os.path.join(tempfile.gettempdir(), "portfolio-data.json")

    def _read(self):
        try:
            with open(self.path, encoding="utf-8") as f:
                return json.load(f)
        except (OSError, ValueError):
            return {"messages": [], "visits": 0}

    def _write(self, data):
        with open(self.path, "w", encoding="utf-8") as f:
            json.dump(data, f)

    def add_message(self, doc):
        with self.lock:
            data = self._read()
            data["messages"].insert(0, doc)
            self._write(data)

    def list_messages(self):
        return self._read()["messages"][:200]

    def get_visits(self):
        return self._read()["visits"]

    def add_visit(self):
        with self.lock:
            data = self._read()
            data["visits"] += 1
            self._write(data)
            return data["visits"]


_store = None


def store():
    global _store
    if _store is None:
        uri = os.environ.get("MONGODB_URI", "").strip()
        _store = MongoStore(uri) if uri else FileStore()
    return _store


# ---------------------------------------------------------------- features
def check_contact(data):
    """Return (clean_values, errors) for the contact form."""
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    message = str(data.get("message", "")).strip()
    errors = {}
    if len(name) < 2:
        errors["name"] = "Enter your name."
    elif len(name) > 80:
        errors["name"] = "Keep the name under 80 characters."
    if not EMAIL_RE.match(email) or len(email) > 120:
        errors["email"] = "Enter a valid email address, like name@example.com."
    if len(message) < 10:
        errors["message"] = "Write at least 10 characters."
    elif len(message) > 2000:
        errors["message"] = "Keep the message under 2000 characters."
    return {"name": name, "email": email, "message": message}, errors


def contact():
    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict):
        return jsonify(ok=False, error="Send the form as JSON."), 400
    if str(data.get("website", "")).strip():  # hidden field: only bots fill it in
        return jsonify(ok=True)
    clean, errors = check_contact(data)
    if errors:
        return jsonify(ok=False, errors=errors), 400
    clean["sent_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
    store().add_message(clean)
    return jsonify(ok=True, message="Message sent")


def visits():
    count = store().add_visit() if request.method == "POST" else store().get_visits()
    return jsonify(count=count)


def messages():
    key = os.environ.get("ADMIN_KEY", "")
    if not key or request.args.get("key", "") != key:
        return jsonify(error="Not allowed."), 403
    return jsonify(messages=store().list_messages())


def health():
    return jsonify(ok=True, backend="python-flask", storage=store().name)


ROUTES = {
    "contact": (contact, {"POST"}),
    "visits": (visits, {"GET", "POST"}),
    "messages": (messages, {"GET"}),
    "health": (health, {"GET"}),
}


@app.route("/api", methods=["GET", "POST"], strict_slashes=False)
@app.route("/api/<path:action>", methods=["GET", "POST"])
def api(action="health"):
    action = action.strip("/").split("/")[-1]
    if action in ("index", "index.py"):
        action = "health"
    if action not in ROUTES:
        return jsonify(error="Unknown address."), 404
    handler, methods = ROUTES[action]
    if request.method not in methods:
        return jsonify(error="Method not allowed."), 405
    try:
        return handler()
    except Exception as exc:  # database down, wrong password, etc.
        app.logger.exception(exc)
        return jsonify(ok=False, error="The server could not save that. Try again in a moment."), 500


@app.errorhandler(413)
def too_large(_):
    return jsonify(ok=False, error="That message is too large."), 413


# ---------------------------------------------------------------- local run only
# On Vercel the HTML, CSS and JS are served by Vercel itself; these two routes
# let the whole site run from one command on your own computer.
@app.route("/")
def home():
    return send_from_directory(ROOT, "index.html")


@app.route("/<path:filename>")
def static_files(filename):
    if filename.split("/")[0] not in ("css", "js", "assets"):
        return jsonify(error="Not found."), 404
    return send_from_directory(ROOT, filename)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
