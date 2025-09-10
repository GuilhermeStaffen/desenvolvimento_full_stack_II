const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

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

      await Cart.destroy({ where: { userId } });

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
  },

  async myOrders(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const offset = (pageNumber - 1) * limitNumber;

      const totalItems = await Order.count({ where: { userId } });

      if (totalItems === 0) {
        return res.status(404).json({ error: 'Nenhum pedido encontrado.' });
      }

      const orders = await Order.findAll({
        where: { userId },
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Product,
                attributes: ['id', 'name']
              }
            ]
          }
        ],
        limit: limitNumber,
        offset,
        order: [['createdAt', 'DESC']]
      });

      const totalPages = Math.ceil(totalItems / limitNumber);

      const formattedOrders = orders.map(order => ({
        id: order.id,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        products: order.OrderItems.map(oi => ({
          productId: oi.productId,
          name: oi.Product?.name,
          quantity: oi.quantity,
          unitPrice: oi.unitPrice,
          subtotal: oi.subtotal
        }))
      }));

      res.json({
        page: pageNumber,
        limit: limitNumber,
        totalItems,
        totalPages,
        items: formattedOrders
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno' });
    }
  }
}