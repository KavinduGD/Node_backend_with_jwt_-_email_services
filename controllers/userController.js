const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 character");
  }

  // check if user email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
  }

  //create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  //generate  token
  const token = generateToken(user._id);

  //send http only cookie

  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({ _id, name, email, photo, phone, bio, token });
  } else {
    res.status(400);
    throw new Error("User not created");
  }
});

//Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Validate request
  if (!email || !password) {
    res.status(400);
    throw new Error("Invalid user data");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found,Please signup");
  }

  //if user exist check the password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (isPasswordCorrect) {
    //generate  token
    const token = generateToken(user._id);

    //send http only cookie

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });

    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({ _id, name, email, photo, phone, bio, token });
  } else {
    res.status(400);
    throw new Error("Invalid email or Password");
  }
});

//Logout user
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ message: "Successfully logged out" });
});

//Get user profile details
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({ _id, name, email, photo, phone, bio });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//Get login status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);

  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});

//Update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio } = user;

    user.email = email;
    user.name = req.body.name || name;
    user.photo = req.body.photo || photo;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;

    const updatedUser = await user.save();
    console.log(updatedUser);
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User not found, Please login");
  }

  //validate
  if (!oldPassword || !password) {
    res.send(400);
    throw new Error("Please add old and new password");
  }

  //check if old password is correct
  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  //save new password
  if (passwordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password change successfully");
  } else {
    res.status(400);
    throw new Error("Old password is incorrect");
  }
  const { name, email, photo, phone, bio } = user;
});

const forgotPassword = asyncHandler(async (req, res) => {
  res.send("fotgot pass");
});
module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
};
