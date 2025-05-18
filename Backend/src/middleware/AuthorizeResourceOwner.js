// middleware/authorizeResourceOwner.js
module.exports = (modelo) => {
  return async (req, res, next) => {
    try {
      const recurso = await modelo.findByPk(req.params.id)

      if (!recurso) {
        return res.status(404).json({ error: 'Recurso no encontrado' })
      }

      if (recurso.usuarioId !== req.user.id) {
        return res.status(403).json({ error: 'No tienes permiso para modificar este recurso' })
      }

      next()
    } catch (error) {
      console.error('Error en autorización:', error)
      res.status(500).json({ error: 'Error interno en autorización' })
    }
  }
}
