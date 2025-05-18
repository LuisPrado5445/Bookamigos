const { Follow, User } = require('../models');

exports.seguir = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const { seguidoId } = req.body;

    if (seguidorId === seguidoId) {
      return res.status(400).json({ error: 'No puedes seguirte a ti mismo' });
    }

    const existente = await Follow.findOne({ where: { seguidorId, seguidoId } });
    if (existente) {
      return res.status(400).json({ error: 'Ya sigues a este usuario' });
    }

    const nuevo = await Follow.create({ seguidorId, seguidoId });
    res.status(201).json({ mensaje: 'Ahora sigues a este usuario', follow: nuevo });
  } catch (error) {
    res.status(500).json({ error: 'Error al seguir', detalle: error.message });
  }
};

exports.dejarDeSeguir = async (req, res) => {
  try {
    const seguidorId = req.user.id;
    const { seguidoId } = req.params;

    const follow = await Follow.findOne({ where: { seguidorId, seguidoId } });
    if (!follow) return res.status(404).json({ error: 'No estás siguiendo a este usuario' });

    await follow.destroy();
    res.json({ mensaje: 'Has dejado de seguir al usuario' });
  } catch (error) {
    res.status(500).json({ error: 'Error al dejar de seguir' });
  }
};

exports.getSeguidores = async (req, res) => {
  try {
    const { userId } = req.params;
    const seguidores = await Follow.findAll({
      where: { seguidoId: userId },
      include: [{ model: User, as: 'seguidor', attributes: ['id', 'nombre'] }]
    });
    res.json(seguidores.map(f => f.seguidor));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener seguidores' });
  }
};

exports.getSeguidos = async (req, res) => {
  try {
    const { userId } = req.params;
    const seguidos = await Follow.findAll({
      where: { seguidorId: userId },
      include: [{ model: User, as: 'seguido', attributes: ['id', 'nombre'] }]
    });
    res.json(seguidos.map(f => f.seguido));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener seguidos' });
  }
};
