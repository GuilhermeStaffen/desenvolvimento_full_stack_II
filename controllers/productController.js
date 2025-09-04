const { Product } = require('../models');

const productController = {
  async create(req, res) {
    try {
      const { name, price, quantity } = req.body;

      if (!name || price === undefined || quantity === undefined) {
        return res.status(400).json({ error: 'Name, price e quantity são obrigatórios.' });
      }

      const product = await Product.create({ name, price, quantity });
      res.status(201).json(product);

    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Já existe um produto com esse nome.' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, price, quantity } = req.body;

      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });

      await product.update({
        name: name || product.name,
        price: price !== undefined ? price : product.price,
        quantity: quantity !== undefined ? quantity : product.quantity
      });

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Product.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ error: 'Produto não encontrado.' });
      res.json({ deletedID: id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async list(req, res) {
    try {
      const { name, price, quantity } = req.query;
      const where = {};

      if (name) where.name = { [require('sequelize').Op.like]: `%${name}%` };
      if (price) where.price = price;
      if (quantity) where.quantity = quantity;

      const products = await Product.findAll({ where });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = productController;
