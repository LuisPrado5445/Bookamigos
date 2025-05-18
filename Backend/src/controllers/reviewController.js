// controllers/reviewController.js
const { Review, User, Book } = require('../models');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, as: 'autorReview', attributes: ['id', 'nombre'] },
        { model: Book, as: 'libroReview', attributes: ['id', 'titulo'] }
      ]
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ error: 'Error al obtener reseñas' });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id, {
      include: [
        { model: User, as: 'autorReview', attributes: ['id', 'nombre'] },
        { model: Book, as: 'libroReview', attributes: ['id', 'titulo'] }
      ]
    });
    if (!review) return res.status(404).json({ error: 'Reseña no encontrada' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la reseña' });
  }
};

exports.getReviewsByBook = async (req, res) => {
  try {
    const { libroId } = req.params;
    const reviews = await Review.findAll({
      where: { libroId },
      include: [
        { model: User, as: 'autorReview', attributes: ['id', 'nombre'] },
        { model: Book, as: 'libroReview', attributes: ['id', 'titulo'] }
      ]
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error al obtener reseñas por libro:', error);
    res.status(500).json({ error: 'Error al obtener reseñas por libro' });
  }
};


exports.createReview = async (req, res) => {
  try {
    const { contenido, puntuacion, libroId } = req.body;
    const userId = req.user.id;

    if (!contenido || !puntuacion || !libroId) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevaReseña = await Review.create({
      contenido,
      puntuacion,
      usuarioId: userId,
      libroId
    });

    res.status(201).json(nuevaReseña);
  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ error: 'Error al crear reseña' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ error: 'Reseña no encontrada' });

    if (review.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado para modificar esta reseña' });
    }

    const { contenido, puntuacion } = req.body;
    await review.update({
      contenido: contenido ?? review.contenido,
      puntuacion: puntuacion ?? review.puntuacion
    });

    res.json({ message: 'Reseña actualizada correctamente', review });
  } catch (error) {
    console.error('Error al actualizar reseña:', error);
    res.status(500).json({ error: 'Error al actualizar la reseña' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ error: 'Reseña no encontrada' });

    if (review.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado para eliminar esta reseña' });
    }

    await review.destroy();
    res.json({ message: 'Reseña eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    res.status(500).json({ error: 'Error al eliminar la reseña' });
  }
};
