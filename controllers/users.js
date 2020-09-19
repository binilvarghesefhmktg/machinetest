const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Redis = require("ioredis");
// const redis = new Redis();

const HttpError = require("../helper/httpError");
const User = require("../models/user");

//API to register an user.
const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    HttpError(res, 422, {
      message: "Invalid inputs passed, please check your data.",
    });
    return;
  }

  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    HttpError(res, 500, {
      message: "Registration failed, please try again later.",
    });
    return;
  }

  if (existingUser) {
    HttpError(res, 422, {
      message: "User exists already, please login.",
    });
    return;
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    HttpError(res, 500, {
      message: "Could not create user, please try again.",
    });
    return;
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (err) {
    HttpError(res, 500, {
      message: "'Signing up failed, please try again later.",
    });
    return;
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "BINILVARGHESE",
      { expiresIn: "1h" }
    );
  } catch (err) {
    HttpError(res, 500, {
      message: "'Signing up failed, please try again later.",
    });
    return;
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

//API to login.
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    HttpError(res, 500, {
      message: "Logging in failed, please try again later.",
    });
    return;
  }

  if (!existingUser) {
    HttpError(res, 403, {
      message: "Invalid credentials",
    });
    return;
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    HttpError(res, 500, {
      message: "Logging in failed, please try again later.",
    });
    return;
  }

  if (!isValidPassword) {
    HttpError(res, 403, {
      message: "Invalid credentials",
    });
    return;
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "BINILVARGHESE",
      { expiresIn: "1h" }
    );
  } catch (err) {
    HttpError(res, 500, {
      message: "Logging in failed, please try again later.",
    });
    return;
  }
  existingUser.lastLogin = Date.now();
  try {
    await existingUser.save();

    // redis.set(existingUser.id, token, 'ex', 36000);
    
    res.json({
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    });
  } catch (err) {
    HttpError(res, 500, {
      message: "Logging in failed, please try again later.",
    });
    return;
  }
 
};

//API to get the user profile
const getProfile = async (req, res, next) => {
  const userId = req.userData.userId;

  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (err) {
    HttpError(res, 500, {
      message: "Something went Wrong",
    });
    return;
  }
  // redis.set(existingUser.id, token, 'ex', 36000);
  res.json({ user: user });
};

// API to get the users list.
const getUsersList = async (req, res, next) => {
  let users;

  // const keys = await redis.collection.keys('*');
  // const values = await redis.collection.mget(keys);

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    HttpError(res, 500, {
      message: "Something went Wrong",
    });
    return;
  }
  res.json({ users: users });
};

exports.register = register;
exports.login = login;
exports.getProfile = getProfile;
exports.getUsersList = getUsersList;
