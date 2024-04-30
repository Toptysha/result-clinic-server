const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function getUsers() {
  const users = await User.find();
  return users;
}

async function getUser(token) {
  if (!token) {
    return null;
  }

  const tokenData = jwt.verify(token, process.env.JWT_SECRET);

  return tokenData.email;
}

async function getUserByEmail(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

async function addUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ email, password: passwordHash });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, user };
}

async function authUser(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, user };
}

module.exports = { getUsers, getUser, getUserByEmail, addUser, authUser };
