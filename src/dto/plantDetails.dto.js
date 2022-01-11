module.exports = (plant) => {
  return {
    _id: plant._id,
    name: plant.name,
    images: plant.images,
    price: plant.price,
    description: plant.description,
    slug: plant.slug,
    specification: {
      height: plant.specification.height,
      maxHeight: plant.specification.maxHeight,
      color: plant.specification.color,
      difficulty: plant.specification.difficulty,
    },
    availability: plant.availability,
    createdAt: plant.createdAt,
    updatedAt: plant.updatedAt,
    plantCollection: {
      name: plant.plantCollection.name,
      image: plant.plantCollection.image,
      slug: plant.plantCollection.slug,
      description: plant.plantCollection.description,
    },
  };
};
