const { Book } = require('../models');
const librosData = require('../librosData.json');

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ error: 'Error al obtener libros' });
  }
};

const cargarLibrosDesdeJson = async (req, res) => {
  try {
    await Book.bulkCreate(librosData);
    res.status(201).json({ message: 'Libros cargados desde JSON correctamente' });
  } catch (error) {
    console.error('Error al cargar libros desde JSON:', error);
    res.status(500).json({ error: 'Error cargando libros desde JSON' });
  }
};

module.exports = {
  getAllBooks,
  cargarLibrosDesdeJson
};
