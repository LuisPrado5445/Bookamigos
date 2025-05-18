// controllers/bookController.js
const { Book, User } = require('../models');

// Crear un nuevo libro
const crearLibro = async (req, res) => {
  const { titulo, autor, portada, descripcion, disponible } = req.body;

  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Token inválido o usuario no autenticado' });
    }

    const nuevoLibro = await Book.create({
      titulo,
      autor,
      portada,
      descripcion,
      disponible: disponible ?? true,
      usuarioId: req.user.id
    });

    res.status(201).json(nuevoLibro);
  } catch (error) {
    console.error('Error al crear libro:', error);
    res.status(500).json({ message: 'Error al guardar el libro', detalle: error.message });
  }
};

// Obtener todos los libros con datos del creador
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      include: {
        model: User,
        as: 'creador',
        attributes: ['id', 'nombre', 'email']
      }
    });
    res.json(books);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ error: 'Error al obtener libros' });
  }
};

// Obtener un solo libro por ID
const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id, {
      include: {
        model: User,
        as: 'creador',
        attributes: ['id', 'nombre', 'email']
      }
    });
    if (!book) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error al obtener libro por ID:', error);
    res.status(500).json({ error: 'Error al obtener el libro' });
  }
};

// Actualizar un libro
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { titulo, autor, portada, descripcion, disponible } = req.body;

  try {
    const libro = await Book.findByPk(id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });

    if (libro.usuarioId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para modificar este libro' });
    }

    await libro.update({
      titulo: titulo ?? libro.titulo,
      autor: autor ?? libro.autor,
      portada: portada ?? libro.portada,
      descripcion: descripcion ?? libro.descripcion,
      disponible: disponible ?? libro.disponible
    });

    res.json({ message: 'Libro actualizado correctamente', libro });
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    res.status(500).json({ error: 'Error al actualizar el libro' });
  }
};

// Eliminar un libro
const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const libro = await Book.findByPk(id);
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });

    if (libro.usuarioId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado para eliminar este libro' });
    }

    await libro.destroy();
    res.json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    res.status(500).json({ error: 'Error al eliminar el libro' });
  }
};

module.exports = {
  crearLibro,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
};
