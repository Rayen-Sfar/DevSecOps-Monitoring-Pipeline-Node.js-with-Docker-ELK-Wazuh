# bruteforce.py
import requests
import time

URL = "http://localhost/api/login"
USERNAME = "admin"
PASSWORDS = ["essai1", "essai2", "essai3", "essai4", "essai5", "essai6", "essai7", "essai8", "essai9", "essai10"]

for pwd in PASSWORDS:
    payload = {"username": USERNAME, "password": pwd}
    r = requests.post(URL, json=payload)
    print(f"[+] Tentative avec '{pwd}' -> {r.status_code}")
    time.sleep(0.2)