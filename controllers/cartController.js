const Cart = require('../models/Cart');
const Product = require('../models/Product');

const cartController = {
  async addItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId, quantity } = req.body;

      if (!productId || !quantity) {
        return res.status(400).json({ error: 'productId e quantity são obrigatórios.' });
      }

      const product = await Product.findByPk(productId);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

      if (product.quantity < quantity) {
        return res.status(400).json({ error: 'Item não possui estoque suficiente' });
      }

      let cartItem = await Cart.findOne({ where: { userId, productId } });
      if (cartItem) {
        const newQuantity = cartItem.quantity + quantity;
        if (product.quantity < newQuantity) {
          return res.status(400).json({ error: 'Estoque insuficiente' });
        }
        await cartItem.update({ quantity: newQuantity });
      } else {
        cartItem = await Cart.create({ userId, productId, quantity });
      }

      return cartController.getCart(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno' });
    }
  },

  async updateItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;
      const { quantity } = req.body;

      if (quantity === undefined) {
        return res.status(400).json({ error: 'quantity é obrigatório' });
      }

      const product = await Product.findByPk(productId);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

      const cartItem = await Cart.findOne({ where: { userId, productId } });

      if (quantity <= 0) {
        if (cartItem) await cartItem.destroy();
      } else {
        if (product.quantity < quantity) {
          return res.status(400).json({ error: 'Estoque insuficiente' });
        }
        if (cartItem) {
          await cartItem.update({ quantity });
        } else {
          await Cart.create({ userId, productId, quantity });
        }
      }

      return cartController.getCart(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno' });
    }
  },

  async removeItem(req, res) {
    try {
      const userId = req.user.id;
      const { productId } = req.params;

      const cartItem = await Cart.findOne({ where: { userId, productId } });
      if (!cartItem) return res.status(404).json({ error: 'Item não encontrado no carrinho' });

      await cartItem.destroy();

      return cartController.getCart(req, res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno' });
    }
  },

  async getCart(req, res) {
    try {
      const userId = req.user.id;

      const items = await Cart.findAll({
        where: { userId },
        include: [{ model: Product, attributes: ['name', 'price'] }]
      });

      let total = 0;
      const formattedItems = items.map(i => {
        const subtotal = i.quantity * i.Product.price;
        total += subtotal;
        return {
          productId: i.productId,
          name: i.Product.name,
          quantity: i.quantity,
          unitPrice: i.Product.price,
          subtotal
        };
      });

      return res.status(200).json({ userId, items: formattedItems, total });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno' });
    }
  }
};

module.exports = cartController;
