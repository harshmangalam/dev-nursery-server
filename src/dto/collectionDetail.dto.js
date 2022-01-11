module.exports = (collection) => {
  return {
    _id: collection._id,
    name: collection.name,
    image: collection.image,
    slug: collection.slug,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
    description: collection.description,
    plants: collection.plants,
    countPlants: collection.countPlants,
  };
};
