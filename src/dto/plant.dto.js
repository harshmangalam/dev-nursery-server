module.exports = (plant) => {
  return {
    _id: plant._id,
    name: plant.name,
    images: plant.images.slice(0,1),
    price: plant.price,
    slug: plant.slug,
    availability: plant.availability,
  };
};
