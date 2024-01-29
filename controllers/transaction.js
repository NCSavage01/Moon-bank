import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Transaction from "../models/transaction.js";

export const fundUserBalance = async (req, res) => {
  const walletId = req.body.walletId;
  const amount = req.body.amount;

  const user = await User.findOne({ walletId });
  try {
    user.balance += Number(amount);
    await User.findByIdAndUpdate(
      user._id,
      { balance: user.balance },
      { new: true }
    );

    // Save the updated user document
    await user.save();

    res.status(200).json({
      message: `Your transaction of ${amount} was successful!`,
    });
  } catch (err) {
    res.status(400).json({
      message: ` Your transaction of ${amount} was declined!`,
    });
  }
};

export const transferFund = async (req, res) => {
  const senderId = req.body.sender_walletId;
  const receiverId = req.body.receiver_walletId;
  let amount = req.body.amount;
  let pin = req.body.pin;

  if (senderId === receiverId)
    return res
      .status(400)
      .json({ message: "Cannot transfer to the same account" });

  // Verify that the IDs exist
  const sender = await User.findOne({ walletId: senderId });
  const receiver = await User.findOne({ walletId: receiverId });

  if (!sender || !receiver)
    return res.status(400).json({ message: "Invalid ID" });

  const isMatch = await bcrypt.compare(pin, sender.pin);

  // Ensure sender has enough balance to make this transaction
  let senderBalance = sender.balance;

  if (isMatch && senderBalance >= amount) {
    // Debit the sender and credit the receiver
    sender.balance -= amount;
    receiver.balance = Number(receiver.balance) + Number(amount);

    // Update the balances using findByIdAndUpdate
    await User.findByIdAndUpdate(
      sender._id,
      { balance: sender.balance },
      { new: true }
    );
    const data = await User.findByIdAndUpdate(
      receiver._id,
      { balance: receiver.balance },
      { new: true }
    );

    await sender.save();
    await receiver.save();

    await Transaction.create({
      sender_walletId: senderId,
      receiver_walletId: receiverId,
      amount,
      message: ` Successful`,
    });

    try {
      res.status(200).json({
        message: ` Successful`,
      });
    } catch (err) {
      res.status(200).json({
        message: ` Declined`,
      });
    }
  } else {
    res.status(400).json({
      message: " You don't have enough funds to complete this transaction ",
    });
  }
};


export const history = async (req, res, next) => {
  const { walletId } = req.params;
  const sent = await Transaction.find({ sender_walletId: walletId });
  const received = await Transaction.find({ receiver_walletId: walletId });
  const data = [...sent, ...received];

  res.status(200).json({ message: `Transfer history`, data });
};