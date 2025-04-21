// src/controllers/followController.js
const db = require('../models');
const Follow = db.Follow;

exports.seguirUsuario = async (req, res) => {
  try {
    const { seguidoId } = req.body;
    const seguidorId = req.user.id;

    if (seguidorId === seguidoId) {
      return res.status(400).json({ mensaje: "No puedes seguirte a ti mismo." });
    }

    const [follow, creado] = await Follow.findOrCreate({
      where: { seguidorId, seguidoId }
    });

    if (!creado) {
      return res.status(400).json({ mensaje: "Ya sigues a este usuario." });
    }

    res.status(201).json({ mensaje: "Ahora sigues a este usuario." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerSeguidores = async (req, res) => {
  try {
    const seguidores = await Follow.findAll({
      where: { seguidoId: req.params.id },
      include: [{ model: db.User, as: 'seguidor', attributes: ['id', 'nombre', 'email'] }]
    });

    res.json(seguidores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
