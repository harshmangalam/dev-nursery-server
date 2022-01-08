const User = require("../models/user.model");

const { verifyJwtToken } = require("../utils/token.util");

module.exports = async (req, res, next) => {
  try {
    // verify  auth token
    const token = req.cookies.token;
    if (!token) {
      return next({ status: 403, message: "JWT token is missing" });
    }
    const userId = verifyJwtToken(token, next);
    if (!userId) {
      return next({ status: 403, message: "JWT token is invalid" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return next({ status: 404, message: "User does not exists" });
    }
    res.locals.user = user;
    return next();
  } catch (err) {
    next(err);
  }
};
