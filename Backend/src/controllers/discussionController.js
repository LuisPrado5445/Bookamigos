const { Discusion, User, Book } = require('../models');

exports.obtenerDiscusiones = async (req, res) => {
  try {
    const discusiones = await Discusion.findAll({
      include: [
        { model: User, as: 'usuario', attributes: ['id', 'nombre', 'email'] },
        { model: Book, as: 'libro', attributes: ['id', 'titulo'] }
      ],
    });
    res.json(discusiones);
  } catch (error) {
    console.error('Error al obtener discusiones:', error);
    res.status(500).json({ error: 'Error al obtener discusiones' });
  }
};

exports.crearDiscusion = async (req, res) => {
  const { contenido, libroId, usuarioId } = req.body;

  try {
    const nuevaDiscusion = await Discusion.create({ contenido, libroId, usuarioId });
    res.status(201).json(nuevaDiscusion);
  } catch (error) {
    console.error('Error al crear discusión:', error);
    res.status(500).json({ error: 'Error al crear la discusión' });
  }
};
