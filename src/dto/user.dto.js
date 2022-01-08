module.exports = (user) => {
  return {
    ...user._doc,
    __v: undefined,
    password: undefined,
  };
};
