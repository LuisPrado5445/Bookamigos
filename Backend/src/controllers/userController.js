const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

const createUser = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const existente = await User.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
    }

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await User.create({ nombre, email, password: hashedPassword });
    res.status(201).json({ message: 'Usuario creado correctamente', usuario: nuevoUsuario });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ order: [['id', 'ASC']] });
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id.trim()); // elimina espacios y convierte a número

    if (isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const usuario = await User.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

     res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      descripcion: usuario.descripcion,
      fotoperfil: usuario.fotoperfil // ✅ AÑADIR ESTO
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un nuevo usuario con encriptación de contraseña
const createAdminUser = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const existente = await User.findOne({ where: { email } });
    if (existente) {
      return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
    }

    // Encriptar la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await User.create({ nombre, email, password: hashedPassword });
    res.status(201).json({ message: 'Usuario creado correctamente', usuario: nuevoUsuario });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

// Función para registrar un nuevo usuario
const registerUser = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ nombre, email, password: hashedPassword });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: 'Confirmación de Registro',
      text: `Haz clic en el siguiente enlace para confirmar tu registro: http://localhost:3001/confirm/${newUser.id}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo:', error);
        return res.status(500).json({ error: 'Error al enviar el correo de confirmación' });
      }

      console.log('Correo enviado:', info.response);
      return res.status(201).json(newUser);
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const confirmEmail = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Aquí podrías poner la lógica para actualizar un campo 'confirmed' en el usuario
    user.confirmed = true;
    await user.save();

    res.status(200).json({ message: 'Email confirmado exitosamente' });
  } catch (error) {
    console.error('Error al confirmar el email:', error);
    res.status(500).json({ error: 'Hubo un error al confirmar el email' });
  }
};

// Función para enviar el correo de recuperación de contraseña
const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    await user.update({ resetToken, resetTokenExpiration: expirationDate });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Restablecimiento de Contraseña',
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: http://localhost:3001/reset-password/${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar el correo:', error);
        return res.status(500).json({ error: 'Error al enviar el correo de restablecimiento' });
      }

      console.log('Correo enviado:', info.response);
      return res.status(200).json({ message: 'Correo de restablecimiento enviado' });
    });

  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para restablecer la contraseña
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Verificar si el token es válido y no ha expirado
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: { [Op.gt]: new Date() }, // fecha actual
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar datos
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ error: 'Hubo un error al restablecer la contraseña' });
  }
};

// Función para iniciar sesión
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, 'secretkey', { expiresIn: '1h' });

   res.status(200).json({
  message: 'Inicio de sesión exitoso',
  token,
  usuario: {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    descripcion: user.descripcion,
    fotoperfil: user.fotoperfil
  }
});

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Debe ser un número.' });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

    // Si se proporciona una nueva contraseña, encriptarla
    let nuevaPassword = user.password;
    if (password) {
      const bcrypt = require('bcrypt');
      nuevaPassword = await bcrypt.hash(password, 10);
    }

    // Actualizar los campos
    await user.update({
      nombre: nombre || user.nombre,
      email: email || user.email,
      password: nuevaPassword
    });

    res.status(200).json({ message: 'Usuario actualizado correctamente.', user });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Eliminar el usuario
    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// Editar perfil (nombre, email, contraseña)
const editProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { nombre, email, password } = req.body;

    if (userId !== req.user.id.toString()) {
      return res.status(403).json({ error: 'No tienes permiso para editar este perfil' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    user.nombre = nombre || user.nombre;
    user.email = email || user.email;

    // Encriptar nueva contraseña solo si se proporciona
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({ message: 'Perfil actualizado con éxito', user });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Hubo un error al actualizar el perfil' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Buscar al usuario por ID
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Retornar el perfil del usuario
    res.status(200).json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      // Agrega aquí cualquier otro dato que quieras mostrar
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el perfil del usuario' });
  }

};
// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ no usar params

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      descripcion: user.descripcion,
      fotoperfil: user.fotoperfil
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};


// Actualizar perfil del usuario autenticado
const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { nombre, descripcion, fotoperfil } = req.body;

    if (!nombre && !descripcion && !fotoperfil) {
      return res.status(400).json({ error: 'No hay datos para actualizar' });
    }

    if (nombre) user.nombre = nombre;
    if (descripcion) user.descripcion = descripcion;
    if (fotoperfil) user.fotoperfil = fotoperfil;

    await user.save();

    res.json({ message: 'Perfil actualizado correctamente', user });
  } catch (error) {
    console.error('Error al actualizar perfil:', error); // para depurar más a fondo si persiste
    res.status(500).json({ error: error.message }); // Mostrar mensaje real
  }
};
const cambiarPassword = async (req, res) => {
  const { passwordActual, nuevaPassword } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    const esCorrecta = await bcrypt.compare(passwordActual, user.password);
    if (!esCorrecta) {
      return res.status(400).json({ error: 'La contraseña actual no es correcta' });
    }

    const nuevaHash = await bcrypt.hash(nuevaPassword, 10);
    user.password = nuevaHash;
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
const subirFotoPerfil = async (req, res) => {
  try {
    const usuario = await User.findByPk(req.user.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const relativePath = `/uploads/perfiles/${req.file.filename}`;
    const fullPath = path.join('C:/temp_uploads/perfiles', req.file.filename);

    if (!fs.existsSync(fullPath)) {
      console.error('❌ Archivo no encontrado después de la subida:', fullPath);
      return res.status(500).json({ error: 'El archivo no está disponible. Intenta de nuevo.' });
    }

    usuario.fotoperfil = relativePath;
    await usuario.save();

    res.json({ message: '✅ Foto de perfil actualizada', fotoperfil: usuario.fotoperfil });
  } catch (error) {
    console.error('❌ Error al subir foto:', error);
    res.status(500).json({ error: 'Error al actualizar foto de perfil' });
  }
};


module.exports = {
  createUser,
  getUsers,
  getUserById,
  createAdminUser,
  registerUser,
  loginUser,
  confirmEmail,
  sendPasswordResetEmail,
  resetPassword,
  updateUser,
  deleteUser,
  editProfile,
  getUserProfile,
  getProfile,         
  updateProfile,       
  cambiarPassword,
  subirFotoPerfil
};
