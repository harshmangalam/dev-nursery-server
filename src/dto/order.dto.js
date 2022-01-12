module.exports = (order) => {
  return {
    _id: order._id,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    shippingAddress: order.shippingAddress,
    plantPrice: order.plantPrice,
    shippingAddress: order.shippingAddress,
    taxPrice: order.taxPrice,
    plantsPrice: order.plantsPrice,
    shippingPrice: order.shippingPrice,
    totalPrice: order.totalPrice,
    paymentMethod: order.paymentMethod,
    paymentDone: order.paymentDone,
    paymentDoneAt: order.paymentDoneAt,
    status: order.status,
    processingAt: order.processingAt,
    outForDeliveryAt: order.outForDeliveryAt,
    deliveredAt: order.deliveredAt,
    cancelAt: order.cancelAt,
    user: {
      _id: order.user._id,
      name: order.user.name,
      email: order.user.email,
    },
    items: order.items.map((item) => ({
      quantity: item.quantity,
      plant: {
        _id: item.plant._id,
        name: item.plant.name,
        slug: item.plant.slug,
        images: item.plant.images,
        price: item.plant.price,
      },
    })),
  };
};
