const { Product, ProductImage } = require('../models');
const { Op } = require('sequelize');

const productController = {
  async create(req, res) {
    try {
      const { name, price, quantity, images } = req.body;

      if (!name || price === undefined || quantity === undefined) {
        return res.status(400).json({ error: 'Name, price e quantity são obrigatórios.' });
      }

      const product = await Product.create({ name, price, quantity, createdBy: req.user.id, updatedBy: req.user.id });

      if (Array.isArray(images) && images.length > 0) {
        const imageRecords = images.map(url => ({ url, productId: product.id }));
        await ProductImage.bulkCreate(imageRecords);
      }

      const productWithImages = await Product.findByPk(product.id, {
        include: { model: ProductImage, as: 'images', attributes: ['url'] }
      });

      res.status(201).json(productWithImages);

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
      const { name, price, quantity, images } = req.body;

      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });

      await product.update({
        name: name || product.name,
        price: price !== undefined ? price : product.price,
        quantity: quantity !== undefined ? quantity : product.quantity,
        updatedBy: req.user.id
      });

      if (Array.isArray(images)) {
        await ProductImage.destroy({ where: { productId: product.id } });
        const imageRecords = images.map(url => ({ url, productId: product.id }));
        await ProductImage.bulkCreate(imageRecords);
      }

      const productWithImages = await Product.findByPk(product.id, {
        include: { model: ProductImage, as: 'images', attributes: ['url'] }
      });

      res.json(productWithImages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Product.destroy({ where: { id } });
      if (!deleted) return res.status(404).json({ error: 'Produto não encontrado.' });
      res.json({ deletedID: id, message: 'Excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async list(req, res) {
    try {
      const { name, price, quantity, minQuantity, maxQuantity, page = 1, limit = 10 } = req.query;
      const where = {};

      if (name) where.name = { [Op.like]: `%${name}%` };
      if (price) where.price = price;
      if (quantity) where.quantity = quantity;

      if (minQuantity || maxQuantity) {
        where.quantity = {};
        if (minQuantity) where.quantity[Op.gte] = parseInt(minQuantity, 10);
        if (maxQuantity) where.quantity[Op.lte] = parseInt(maxQuantity, 10);
      }

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const offset = (pageNumber - 1) * limitNumber;

      const totalItems = await Product.count({ where });

      const products = await Product.findAll({
        where,
        limit: limitNumber,
        offset,
        include: { model: ProductImage, as: 'images', attributes: ['url'] }
      });

      const totalPages = Math.ceil(totalItems / limitNumber);

      res.status(200).json({
        page: pageNumber,
        limit: limitNumber,
        totalItems,
        totalPages,
        items: products
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: { model: ProductImage, as: 'images', attributes: ['url'] }
      });
      if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = productController;
