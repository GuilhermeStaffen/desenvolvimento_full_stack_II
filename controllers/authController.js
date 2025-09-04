const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e password são obrigatórios.' });
      }
      const user = await User.scope(null).findOne({ where: { email } }); 
      if (!user) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }
      const isValid = await user.checkPassword(password);
      if (!isValid) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      const userData = user.toJSON();
      const { password: _, ...userWithoutPassword } = userData;
      const token = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: '8h' });

      res.status(202).json({ token, user: userWithoutPassword });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno' });
    }
  }
};

module.exports = authController;