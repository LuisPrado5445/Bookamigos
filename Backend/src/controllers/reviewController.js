const { Review } = require('../models');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const nuevaReseña = await Review.create(req.body);
    res.status(201).json(nuevaReseña);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear reseña' });
  }
};
