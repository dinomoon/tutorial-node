require('dotenv').config();
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

app.use(express.json());

const refreshTokens = [];

app.post('/token', (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(payload);
    res.json({ accessToken });
  });
});

app.post('/login', (req, res) => {
  // Authenticate User

  const username = req.body.username;
  const payload = { name: username };

  const accessToken = generateAccessToken(payload);
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET);

  refreshTokens.push(refreshToken);

  res.json({ accessToken, refreshToken });
});

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '30s',
  });
}

app.listen(4000);
