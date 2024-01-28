const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/bankApp', { useNewUrlParser: true, useUnifiedTopology: true });
const User = mongoose.model('User', {
  username: String,
  password: String,
  balance: { type: Number, default: 0 }
});

const SECRET_KEY = 'your_secret_key';

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.status(201).send('User registered successfully.');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign({ username: user.username }, SECRET_KEY);
    res.json({ accessToken });
  } else {
    res.status(401).send('Invalid username or password.');
  }
});

app.listen(port, () => {
  console.log(`Bank app listening at http://localhost:${port}`);
});
