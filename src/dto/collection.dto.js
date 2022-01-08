module.exports = (collection) => {
  return {
    ...collection._doc,
    __v: undefined,
  };
};
