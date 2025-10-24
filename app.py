from flask import Flask, render_template_string, request, session, redirect, url_for, send_from_directory, jsonify
from werkzeug.utils import secure_filename
import json, os
from datetime import datetime

app = Flask(__name__)
app.secret_key = "sua_chave_secreta_super_segura"
UPLOAD_FOLDER = "img"
if not os.path.exists(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

USERS_FILE = "users.json"
SPECIAL_USERS = ["Leandro", "Tiago"]

# Reunião em memória
meeting = {
    "active": False,
    "admin": "",
    "participants": {},
}

# Inicializa users.json
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump([], f)

def load_users():
    with open(USERS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=4, ensure_ascii=False)

# Carrega templates
with open("index.html","r",encoding="utf-8") as f: index_html = f.read()
with open("home.html","r",encoding="utf-8") as f: home_html = f.read()
with open("controle.html","r",encoding="utf-8") as f: controle_html = f.read()

@app.route("/img/<filename>")
def img(filename):
    return send_from_directory("img", filename)

@app.route("/", methods=["GET"])
def index():
    if "username" in session:
        return redirect(url_for("home"))
    return render_template_string(index_html)

@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]
    users = load_users()
    for user in users:
        if user["username"] == username:
            if user.get("deleted", False):
                return render_template_string(index_html, error=f"Sua conta foi excluída: {user.get('reaction','')}")
            if user["password"] == password:
                session["username"] = username
                session["avatar"] = user.get("avatar","")
                return redirect(url_for("home"))
    return render_template_string(index_html, error="Usuário ou senha incorretos")

@app.route("/register", methods=["POST"])
def register():
    username = request.form["username"]
    password = request.form["password"]
    avatar_file = request.files.get("avatar")
    users = load_users()

    for user in users:
        if user["username"] == username:
            return render_template_string(index_html, error="Usuário já existe")

    if avatar_file and avatar_file.filename != "":
        filename = f"{username}_{secure_filename(avatar_file.filename)}"
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        avatar_file.save(path)
    else:
        filename = ""

    users.append({
        "username": username,
        "password": password,
        "date": datetime.now().strftime("%d/%m/%Y"),
        "avatar": filename,
        "deleted": False,
        "reaction": "",
        "points": 0,
        "completed_challenges": []
    })
    save_users(users)
    return render_template_string(index_html, error="Conta criada com sucesso!")

@app.route("/home")
def home():
    if "username" not in session:
        return redirect(url_for("index"))
    username = session["username"]
    avatar = session.get("avatar","")
    special = username in SPECIAL_USERS
    users = load_users()
    regular_users = [u for u in users if u["username"] not in SPECIAL_USERS and not u.get("deleted", False)]
    return render_template_string(home_html, username=username, avatar=avatar, special=special, users=regular_users)

@app.route("/change_avatar", methods=["POST"])
def change_avatar():
    if "username" not in session:
        return redirect(url_for("index"))
    avatar_file = request.files.get("avatar")
    if avatar_file and avatar_file.filename != "":
        filename = f"{session['username']}_{secure_filename(avatar_file.filename)}"
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        avatar_file.save(path)
        users = load_users()
        for user in users:
            if user["username"] == session["username"]:
                user["avatar"] = filename
                break
        save_users(users)
        session["avatar"] = filename
    return redirect(url_for("home"))

@app.route("/logout")
def logout():
    session.pop("username", None)
    session.pop("avatar", None)
    return redirect(url_for("index"))

@app.route("/controle", methods=["GET"])
def controle():
    if "username" not in session or session["username"] not in SPECIAL_USERS:
        return redirect(url_for("index"))
    users = load_users()
    regular_users = [u for u in users if u["username"] not in SPECIAL_USERS and not u.get("deleted", False)]
    return render_template_string(controle_html, users=regular_users, meetings=meeting)

@app.route("/delete_user", methods=["POST"])
def delete_user():
    if "username" not in session or session["username"] not in SPECIAL_USERS:
        return redirect(url_for("index"))
    del_user = request.form["username"]
    users = load_users()
    for user in users:
        if user["username"] == del_user:
            user["deleted"] = True
            break
    save_users(users)
    return redirect(url_for("controle"))

# --- Reunião ---
@app.route("/start_meeting", methods=["POST"])
def start_meeting():
    if "username" not in session or session["username"] not in SPECIAL_USERS:
        return redirect(url_for("home"))
    meeting["active"] = True
    meeting["admin"] = session["username"]
    meeting["participants"] = {u["username"]: {"muted": False} for u in load_users() if not u.get("deleted", False)}
    return redirect(url_for("controle"))

@app.route("/end_meeting", methods=["POST"])
def end_meeting():
    if "username" not in session or session["username"] != meeting["admin"]:
        return redirect(url_for("home"))
    meeting["active"] = False
    meeting["admin"] = ""
    meeting["participants"] = {}
    return redirect(url_for("controle"))

@app.route("/meeting_status")
def meeting_status():
    return jsonify(meeting)

@app.route("/mute_participant", methods=["POST"])
def mute_participant():
    if "username" not in session or session["username"] != meeting["admin"]:
        return redirect(url_for("home"))
    username = request.form["username"]
    if username in meeting["participants"]:
        meeting["participants"][username]["muted"] = True
    return jsonify(meeting)

@app.route("/kick_participant", methods=["POST"])
def kick_participant():
    if "username" not in session or session["username"] != meeting["admin"]:
        return redirect(url_for("home"))
    username = request.form["username"]
    if username in meeting["participants"]:
        del meeting["participants"][username]
    return jsonify(meeting)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
