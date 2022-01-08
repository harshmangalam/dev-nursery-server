const User = require("../models/user.model");
const { hashPassword } = require("../utils/password.util");

exports.createAdmin = async () => {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  try {
    const admin = await User.findOne({ email }).select("email");
    if (admin) {
      console.log("admin already exists");
      return;
    }

    const hashedPassword = await hashPassword(password);
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    });

    const saveAdmin = await newAdmin.save();
    console.log(saveAdmin);
  } catch (error) {
    console.log(error);
  }
};
