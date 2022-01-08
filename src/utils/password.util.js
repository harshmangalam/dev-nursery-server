const bcrypt = require("bcrypt");

exports.checkPassword = async (password, hashedPassword) => {
  const matchPassword = await bcrypt.compare(password, hashedPassword);
  return matchPassword;
};

exports.hashPassword = async (password) => {
  const hashed = await bcrypt.hash(password, 12);
  return hashed;
};
