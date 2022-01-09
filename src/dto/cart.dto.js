module.exports = (cart) => {
  return {
    ...cart._doc,
    __v: undefined,
  };
};
