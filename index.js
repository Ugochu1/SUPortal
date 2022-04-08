const express = require("express");
const { sendStatus } = require("express/lib/response");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json())

const posts = [
  {
    name: "Ugochukwu",
    id: 14,
    content: "Post 1"
  },
  {
    name: "Bykee",
    id: 22,
    content: "Post 2"
  }
]

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];
  if (token === null) return sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403)
    req.user = user;
    next();
  })
}

app.get('/posts', authenticateToken, (req, res) => {
  console.log(req.user)
  res.send(posts)
})

const peopleWithAccess = [
  {id: 34},
  {id: 22},
  {id: 7},
  {id: 9}
]

app.get('/private_exam', authenticateToken, (req, res) => {
  console.log(req.user)
  res.send({
    access: true
  })
})

app.post('/login', (req, res) => {
  const user = req.body;
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  res.send({ accessToken })
})

app.listen(process.env.PORT)