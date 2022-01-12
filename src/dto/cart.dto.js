module.exports = (cart) => {
  return {
    _id: cart._id,
    totalPrice: cart.totalPrice,
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
    totalPrice: cart.totalPrice,
    user: {
      _id: cart.user._id,
      name: cart.user.name,
      email: cart.user.email,
    },
    items: cart.items.map((item) => ({
      quantity: item.quantity,
      plant: {
        _id: item.plant._id,
        name: item.plant.name,
        images: item.plant.images,
        slug: item.plant.slug,
        price: item.plant.price,
      },
    })),
  };
};
