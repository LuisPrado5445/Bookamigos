// controllers/discussionController.js
const { Discussion, User, Book } = require('../models');

exports.getAllDiscussions = async (req, res) => {
  try {
    const discusiones = await Discussion.findAll({
      include: [
        { model: User, as: 'participante', attributes: ['id', 'nombre'] },
        { model: Book, as: 'libroComentado', attributes: ['id', 'titulo'] }
      ]
    });
    res.json(discusiones);
  } catch (error) {
    console.error('Error al obtener discusiones:', error);
    res.status(500).json({ error: 'Error al obtener discusiones' });
  }
};

exports.getDiscussionById = async (req, res) => {
  try {
    const { id } = req.params;
    const discusion = await Discussion.findByPk(id, {
      include: [
        { model: User, as: 'participante', attributes: ['id', 'nombre'] },
        { model: Book, as: 'libroComentado', attributes: ['id', 'titulo'] }
      ]
    });
    if (!discusion) return res.status(404).json({ error: 'Discusión no encontrada' });
    res.json(discusion);
  } catch (error) {
    console.error('Error al obtener la discusión:', error);
    res.status(500).json({ error: 'Error al obtener discusión' });
  }
};

exports.createDiscussion = async (req, res) => {
  try {
    const { contenido, libroId, titulo } = req.body;
    const usuarioId = req.user?.id;

    console.log('📥 Datos recibidos en createDiscussion:', {
      contenido, titulo, libroId, usuarioId
    });

    if (!contenido || !libroId || !usuarioId) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nueva = await Discussion.create({
      contenido,
      libroId,
      usuarioId,
      titulo
    });

    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al crear discusión:', error);
    res.status(500).json({ error: 'Error al crear discusión', detalle: error.message });
  }
};

exports.updateDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const discussion = await Discussion.findByPk(id);
    if (!discussion) return res.status(404).json({ error: 'Discusión no encontrada' });

    if (discussion.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado para modificar esta discusión' });
    }

    const { contenido, titulo, libroId } = req.body;

    // Actualizar campos
    await discussion.update({
      contenido: contenido ?? discussion.contenido,
      titulo: titulo ?? discussion.titulo,
      libroId: libroId ?? discussion.libroId
    });

    // Recargar con relaciones
    const discussionActualizada = await Discussion.findByPk(id, {
      include: [
        { model: User, as: 'participante', attributes: ['id', 'nombre'] },
        { model: Book, as: 'libroComentado', attributes: ['id', 'titulo'] }
      ]
    });

    res.json({
      message: 'Discusión actualizada correctamente',
      discussion: discussionActualizada
    });

  } catch (error) {
    console.error('Error al actualizar discusión:', error);
    res.status(500).json({ error: 'Error al actualizar discusión' });
  }
};


exports.deleteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const discussion = await Discussion.findByPk(id);
    if (!discussion) return res.status(404).json({ error: 'Discusión no encontrada' });

    if (discussion.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado para eliminar esta discusión' });
    }

    await discussion.destroy();
    res.json({ message: 'Discusión eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar discusión:', error);
    res.status(500).json({ error: 'Error al eliminar discusión' });
  }
};
