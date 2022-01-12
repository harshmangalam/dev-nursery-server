const User = require("../models/user.model");
const Order = require("../models/order.model");
const { checkPassword, hashPassword } = require("../utils/password.util");
const userDTO = require("../dto/user.dto");
const orderDTO = require("../dto/order.dto");

exports.fetchUsers = async (req, res, next) => {
  try {
    const users = await User.findById(req.params.userId);

    const usersData = [];

    users.forEach((user) => {
      const transformUser = userDTO(user);
      usersData.push(transformUser);
    });

    return res.status(200).json({
      type: "success",
      message: "Fetc user lists",
      data: {
        users: usersData,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    return res.status(200).json({
      type: "success",
      message: "Fetch user details",
      data: {
        user: userDTO(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

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

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = res.locals.user_id;
    const { email, name } = req.body;

    const user = await User.findById(userId);
    user.name = name;
    user.email = email;

    await user.save();

    return res.status(201).json({
      type: "success",
      message: "User profile updated",
      data: {
        user: userDTO(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = res.locals.user_id;
    const { newPassword, oldPassword } = req.body;

    const user = await User.findById(userId).select("+password");
    // match oldPassword

    const matchPassword = await checkPassword(oldPassword, user.password);

    if (!matchPassword) {
      return next({ status: 400, message: "Old password is incorrect" });
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    await user.save();

    return res.status(201).json({
      type: "success",
      message: "User password changed",
      data: {
        user: userDTO(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.changeUserRole = async (req, res, next) => {
  try {
    const userId = res.locals.user_id;
    const { role } = req.body;

    const user = await User.findById(userId).select("role");

    user.role = role;
    await user.save();

    return res.status(201).json({
      type: "success",
      message: "User role changed",
      data: {
        user: userDTO(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.fetchUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: res.locals.user._id }).populate([
      { path: "user", select: "name email" },
      { path: "items.plant", select: "name slug price images" },
    ]);
    const ordersData = [];

    orders.forEach((order) => {
      const transformOrder = orderDTO(order);
      ordersData.push(transformOrder);
    });

    return res.status(200).json({
      type: "success",
      message: "Fetc user lists",
      data: {
        orders: ordersData,
      },
    });
  } catch (error) {
    next(error);
  }
};
