const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const logFile = './app-logs.log';

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const logLine =
      `[${new Date().toISOString()}] ${req.ip} - /api/login - username:${username} - password:${password} - status:${password === "secret" ? "200" : "401"}\n`;

    fs.appendFileSync(logFile, logLine);

    if (password === "secret") {
        res.cookie('auth', 'true', { httpOnly: true, maxAge: 3600000 }); // 1 hour
        res.status(200).json({ message: "Login success" });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

app.get('/auth', (req, res) => {
    if (req.cookies.auth === 'true') {
        res.status(200).send('OK');
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.listen(PORT, () => console.log("API running on port 3000"));
