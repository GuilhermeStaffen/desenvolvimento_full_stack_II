const express = require('express');
const router = express.Router();
const db = require('../database');


function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

router.post('/', async (req, res) => {
    try {
        let { name, password, email, userType } = req.body;

        if (!name || !password || !email) {
            return res.status(400).json({ error: 'Name, email e password são obrigatórios.' });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Email inválido.' });
        }

        if (!userType) {
            userType = 'customer';
        } else if (!['customer', 'admin'].includes(userType.toLowerCase())) {
            return res.status(400).json({ error: 'userType inválido.' });
        }


        const sql = 'INSERT INTO users (name, password, email, user_type) VALUES (?, ?, ?, ?)';
        db.run(sql, [name, password, email, userType], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, name, email, userType });
        });

    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


router.get('/', (req, res) => {
    db.all('SELECT name, email, user_type FROM users', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT name, email, user_type FROM users WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'User not found' });
        res.json(row);
    });
});


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let { name, password, email, userType } = req.body;

        db.get('SELECT * FROM users WHERE id = ?', [id], async (err, user) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

            name = name || user.name;
            password = password || user.password;
            email = email || user.email;
            userType = userType || user.user_type;

            if (!isValidEmail(email)) {
                return res.status(400).json({ error: 'Email inválido.' });
            }

            if (!['customer', 'admin'].includes(userType.toLowerCase())) {
                return res.status(400).json({ error: 'userType inválido.' });
            }

            const sql = `UPDATE users 
                         SET name = ?, password = ?, email = ?, user_type = ?
                         WHERE id = ?`;

            db.run(sql, [name, password, email, userType, id], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ id, name, email, userType });
            });
        });

    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deletedID: id });
    });
});

module.exports = router;