const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/', (req, res) => {
    const { name, price, quantity } = req.body;

    if (!name || price === undefined || quantity === undefined) {
        return res.status(400).json({ error: 'Name, price e quantity são obrigatórios.' });
    }

    const sql = 'INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)';
    db.run(sql, [name, price, quantity], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, price, quantity });
    });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });

        const updatedName = name || product.name;
        const updatedPrice = price !== undefined ? price : product.price;
        const updatedQuantity = quantity !== undefined ? quantity : product.quantity;

        const sql = 'UPDATE products SET name = ?, price = ?, quantity = ? WHERE id = ?';
        db.run(sql, [updatedName, updatedPrice, updatedQuantity, id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id, name: updatedName, price: updatedPrice, quantity: updatedQuantity });
        });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Produto não encontrado.' });
        res.json({ deletedID: id });
    });
});


router.get('/', (req, res) => {
    const { name, price, quantity } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (name) {
        sql += ' AND name LIKE ?';
        params.push(`%${name}%`);
    }

    if (price) {
        sql += ' AND price = ?';
        params.push(price);
    }

    if (quantity) {
        sql += ' AND quantity = ?';
        params.push(quantity);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;