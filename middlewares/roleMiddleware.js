function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    if (!allowedRoles.includes(req.user.userType)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    next();
  };
}

module.exports = authorizeRoles;