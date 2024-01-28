<<<<<<< HEAD
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
=======
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Moon Bank', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for bank information
const bankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true }
});

const Bank = mongoose.model('Bank', bankSchema);

// Define a schema for accounts
const accountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
  bank: { type: mongoose.Schema.Types.ObjectId, ref: 'Bank' } // Reference to Bank model
});

const Account = mongoose.model('Account', accountSchema);

// Define a schema for transactions
const transactionSchema = new mongoose.Schema({
  fromAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  toAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes
app.post('/createBank', async (req, res) => {
  const { name, location } = req.body;

  try {
    const newBank = await Bank.create({ name, location });
    res.json(newBank);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/getBankInfo/:bankId', async (req, res) => {
  const bankId = req.params.bankId;

  try {
    const bank = await Bank.findById(bankId);
    if (!bank) {
      res.status(404).json({ error: 'Bank not found' });
      return;
    }

    res.json(bank);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/createAccount/:bankId/:accountNumber', async (req, res) => {
  const bankId = req.params.bankId;
  const accountNumber = req.params.accountNumber;

  try {
    const bank = await Bank.findById(bankId);
    if (!bank) {
      res.status(404).json({ error: 'Bank not found' });
      return;
    }

    const newAccount = await Account.create({ accountNumber, bank: bank._id });
    res.json(newAccount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/transfer/:fromAccountId/:toAccountId/:amount', async (req, res) => {
  const fromAccountId = req.params.fromAccountId;
  const toAccountId = req.params.toAccountId;
  const amount = parseFloat(req.params.amount);

  try {
    const fromAccount = await Account.findById(fromAccountId);
    const toAccount = await Account.findById(toAccountId);

    if (!fromAccount || !toAccount) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    if (fromAccount.balance < amount) {
      res.status(400).json({ error: 'Insufficient funds' });
      return;
    }

    // Perform the transaction
    const updatedFromBalance = fromAccount.balance - amount;
    const updatedToBalance = toAccount.balance + amount;

    await Account.findByIdAndUpdate(fromAccountId, { balance: updatedFromBalance });
    await Account.findByIdAndUpdate(toAccountId, { balance: updatedToBalance });

    // Record the transaction
    const transaction = await Transaction.create({
      fromAccount: fromAccount._id,
      toAccount: toAccount._id,
      amount
    });

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
>>>>>>> 87f9dea ( added files for users)
