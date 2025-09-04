const { User } = require('../models');

const userController = {
    async create(req, res) {
        try {
            const { name, password, email } = req.body;
            if (!name || !password || !email) {
                return res.status(400).json({ error: 'Name, email e password são obrigatórios.' });
            }

            const user = await User.create({
                name,
                password,
                email
            });

            const { password: _, ...userWithoutPassword } = user.toJSON();
            res.status(201).json(userWithoutPassword);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async list(req, res) {
        try {
            const users = await User.findAll({ attributes: ['id', 'name', 'email', 'userType', 'createdAt', 'updatedAt'] });
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id, { attributes: ['id', 'name', 'email', 'userType', 'createdAt', 'updatedAt'] });
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, password, email } = req.body;

            const user = await User.findByPk(id);
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

            await user.update({
                name: name || user.name,
                password: password || user.password,
                email: email || user.email
            });

            const { password: _, ...userWithoutPassword } = user.toJSON();

            res.json(userWithoutPassword);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;
            const deleted = await User.destroy({ where: { id } });
            if (!deleted) return res.status(404).json({ error: 'Usuário não encontrado.' });
            res.json({ deletedID: id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = userController;