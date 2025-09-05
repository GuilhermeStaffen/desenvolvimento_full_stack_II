const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');

module.exports = {
  async create(req, res) {
    try {
      const userId = req.user.id; 
      const { items } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Nenhum item informado.' });
      }

      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findByPk(item.productId);

        if (!product) {
          return res.status(400).json({ error: `Produto ${item.productId} não encontrado.` });
        }

        if (product.quantity < item.quantity) {
          return res.status(400).json({ error: `Produto ${product.name} sem estoque suficiente.` });
        }

        const unitPrice = product.price;
        const subtotal = unitPrice * item.quantity;

        total += subtotal;

        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice,
          subtotal
        });

        await product.update({ quantity: product.quantity - item.quantity });
      }

      const order = await Order.create({ userId, status: 'placed', total });
      for (const oi of orderItems) {
        await OrderItem.create({ ...oi, orderId: order.id });
      }

      const response = {
        id: order.id,
        userId,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        products: orderItems.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          subtotal: i.subtotal
        }))
      };

      res.status(201).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno' });
    }
  }
};