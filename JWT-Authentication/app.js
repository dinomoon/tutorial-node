require('dotenv').config();
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');

app.use(express.json());

const posts = [
  {
    username: 'Choi',
    title: 'Post 1',
  },
  {
    username: 'Park',
    title: 'Post 2',
  },
];

app.get('/posts', authenticateToken, (req, res) => {
  console.log(req.user); // { name: 'Choi', iat: 1639896574, exp: 1639896604 }
  res.json(posts.filter((post) => post.username === req.user.name));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000);
