const { User } = require('../models');

const userController = {
    async create(req, res) {
        try {
            const { name, email, password, phone, address } = req.body;
            if (!name || !email || !password || address === undefined || !address.street || !address.number || !address.city || !address.state || !address.zipcode || !address.country) {
                return res.status(400).json({ error: 'Name, email, endereço e password são obrigatórios.' });
            }

            const user = await User.create({
                name,
                email,
                password,
                phone,
                street: address?.street || '',
                number: address?.number || '',
                city: address?.city || '',
                state: address?.state || '',
                zipcode: address?.zipcode || '',
                country: address?.country || ''
            });

            const { password: _, ...userData } = user.toJSON();
            userData.address = {
                street: userData.street,
                number: userData.number,
                city: userData.city,
                state: userData.state,
                zipcode: userData.zipcode,
                country: userData.country
            };
            delete userData.street;
            delete userData.number;
            delete userData.city;
            delete userData.state;
            delete userData.zipcode;
            delete userData.country;

            res.status(201).json(userData);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, email, password, phone, address } = req.body;

            if (req.user.id !== parseInt(id) && req.user.userType !== 'admin') {
                return res.status(403).json({ error: 'Acesso negado.' });
            }

            const user = await User.findByPk(id);
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

            await user.update({
                name: name || user.name,
                email: email || user.email,
                password: password || user.password,
                phone: phone || user.phone,
                street: address?.street || user.street,
                number: address?.number || user.number,
                city: address?.city || user.city,
                state: address?.state || user.state,
                zipcode: address?.zipcode || user.zipcode,
                country: address?.country || user.country
            });

            const { password: _, ...userData } = user.toJSON();
            userData.address = {
                street: userData.street,
                number: userData.number,
                city: userData.city,
                state: userData.state,
                zipcode: userData.zipcode,
                country: userData.country
            };
            delete userData.street;
            delete userData.number;
            delete userData.city;
            delete userData.state;
            delete userData.zipcode;
            delete userData.country;

            res.json(userData);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async list(req, res) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'name', 'email', 'userType', 'phone', 'street', 'number', 'city', 'state', 'zipcode', 'country', 'createdAt', 'updatedAt']
            });

            const formattedUsers = users.map(u => {
                const { street, number, city, state, zipcode, country, ...rest } = u.toJSON();
                return {
                    ...rest,
                    address: { street, number, city, state, zipcode, country }
                };
            });

            res.json(formattedUsers);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const { id } = req.params;

            if (req.user.id !== parseInt(id) && req.user.userType !== 'admin') {
                return res.status(403).json({ error: 'Acesso negado.' });
            }

            const user = await User.findByPk(id, {
                attributes: ['id', 'name', 'email', 'userType', 'phone', 'street', 'number', 'city', 'state', 'zipcode', 'country', 'createdAt', 'updatedAt']
            });

            if (!user) return res.status(404).json({ error: 'User not found' });

            const { street, number, city, state, zipcode, country, ...rest } = user.toJSON();
            const userData = {
                ...rest,
                address: { street, number, city, state, zipcode, country }
            };

            res.json(userData);
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
