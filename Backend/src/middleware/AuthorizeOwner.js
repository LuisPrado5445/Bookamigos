// middleware/authorizeOwner.js
module.exports = (req, res, next) => {
  const userIdFromToken = req.user.id;
  const userIdFromParams = parseInt(req.params.id, 10);

  if (userIdFromToken === userIdFromParams) {
    next();
  } else {
    return res.status(403).json({ error: 'Solo puedes modificar tu propio perfil' });
  }
};