const asyncWraper = require("../medelware/asyncWraper");
const userModel = require("../models/user.model");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");
const generateJwt = require("../utils/generateJwt");

const getAllUsers = asyncWraper(async (req, res) => {
  console.log(req.headers);

  const query = req.query;

  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;

  //projection in find(projection )and do filter at elements
  const users = await userModel
    .find(/*{price :{$gt :35}}*/ { __v: false })
    .limit(limit)
    .skip(skip);

  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWraper(async (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, email, password, role,} = req.body;
    // console.log("file name ->>>",req.file);

  //validation 000000000000
  const oldUser = await userModel.findOne({ email: email });
  if (oldUser) {
    const error = appError.create(
      "user already exist",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  // password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword, /////////////////////////////////<<<<<<<<<<<<<<<<<<<<<<
    role,
    avatar: req.file.filename
  });

  //generate jwt token
  const token = await generateJwt({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;

  newUser.save();
  res
    .status("201")
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});



const login = asyncWraper(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email && !password) {
    const error = appError.create(
      "user already exist",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const user = await userModel.find({ email: email },{ password: password });

  const matchedPassword = bcrypt.compare(password, user.password);
  if (!user) {
    const error = appError.create("user not found!!", 400, httpStatusText.FAIL);
    return next(error);
  }
  if (user && matchedPassword) {
    const token = await generateJwt({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    
    return res.json({
      status: httpStatusText.SUCCESS,
      data: { token },
    });
  } else {
    const error = appError.create("somthing wrong", 400, httpStatusText.FAIL);
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
