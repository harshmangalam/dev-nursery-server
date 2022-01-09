module.exports = (plant) => {
  return {
    ...plant._doc,
    __v: undefined,
  };
};
