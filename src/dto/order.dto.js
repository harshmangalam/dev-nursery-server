module.exports = (order) => {
    return {
      ...order._doc,
      __v: undefined,
    };
  };
  