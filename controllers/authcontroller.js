const User = require("../models/UserModel")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { json } = require("express");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ firstName, lastName, phone, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.SECRETE_KEY, {
      expiresIn: '24h',
    });
    res.status(201).json({ token, user: { firstName, lastName, phone, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', err });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'User Not Found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Wrong Password' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRETE_KEY, {
      expiresIn: '24h',
    });
    res.json({ token, user: { _id:user._id,firstName:user.firstName, lastName:user.lastName, phone:user.phone, email:user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
