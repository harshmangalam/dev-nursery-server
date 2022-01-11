const User = require("../models/user.model");
const cookie = require("cookie");
const { validationResult } = require("express-validator");
const { checkPassword, hashPassword } = require("../utils/password.util");
const { createJwtToken } = require("../utils/token.util");
const userDTO = require("../dto/user.dto");
// ------------------------- login ------------------------------

exports.login = async (req, res, next) => {
  // return api fields validation errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: "User input error",
      data: errors.mapped(),
    });
  }
  const { email, password } = req.body;
  try {
    // verify email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next({ status: 400, message: "Incorrect email address" });
    }
    // verify password
    const matchPassword = await checkPassword(password, user.password);
    if (!matchPassword) {
      return next({ status: 400, message: "Incorrect password" });
    }

    const token = createJwtToken({ userId: user._id });

    // set token to user frontend cookies 
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 3600 * 12,
        path: "/",
      })
    );

    return res.status(201).json({
      type: "success",
      message: "You have loggedin successfully",
      data: {
        user: userDTO(user),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------------- signup ---------------------------------

exports.signup = async (req, res, next) => {
  // return api fields level error validations 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: "User input error",
      data: errors.mapped(),
    });
  }
  let { email, password, name } = req.body;
  try {
    // check duplicate email
    const emailExist = await User.findOne({ email }).select("email");

    if (emailExist) {
      return next({ status: 400, message: "Email address already exists" });
    }

    // hash password

    let hashedPass = await hashPassword(password);

    // create new user

    const createUser = new User({
      email,
      password: hashedPass,
      name,
    });

    // save user

    const user = await createUser.save();

    return res.status(201).json({
      type: "success",
      message: `Account created for ${user.name}`,
      data: {
        user: userDTO(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------- fetch current user -------------------------

exports.fetchCurrentUser = async (req, res, next) => {
  try {
    // get data already store in response local objects 
    const currentUser = res.locals.user;
    return res.status(200).json({
      type: "success",
      message: "Fetch current user",
      data: {
        user: userDTO(currentUser),
      },
    });
  } catch (error) {
    next(error);
  }
};

// logout user

exports.logout = async (req, res, next) => {
  try {
    // expire cookies from user frontend 
    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      })
    );

    return res.status(200).json({
      type: "success",
      message: "You have loggedout successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
