const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');
const ProductImage = require('../models/ProductImage');

module.exports = {
  async create(req, res) {
    try {
      const userId = req.user.id;
      const { items } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Nenhum item informado.' });
      }

      // Buscar dados do usuário para o endereço
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(400).json({ error: 'Usuário não encontrado.' });
      }

      const fullAddress = `${user.street}, ${user.number}, ${user.city}, ${user.state}, ${user.zipcode}, ${user.country}`;

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

      const order = await Order.create({ userId, status: 'placed', total, fullAddress });

      for (const oi of orderItems) {
        await OrderItem.create({ ...oi, orderId: order.id });
      }

      await Cart.destroy({ where: { userId } });

      const response = {
        id: order.id,
        userId,
        status: order.status,
        total: order.total,
        fullAddress: order.fullAddress,
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
                attributes: ['id', 'name'],
                include: [
                  {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['url']
                  }
                ]
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
        fullAddress: order.fullAddress,
        createdAt: order.createdAt,
        products: order.OrderItems.map(oi => ({
          productId: oi.productId,
          name: oi.Product?.name,
          quantity: oi.quantity,
          unitPrice: oi.unitPrice,
          subtotal: oi.subtotal,
          images: oi.Product?.images?.map(img => ({
            url: img.url
          })) || []
        }))
      }));

      res.status(200).json({
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
  },

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, status, userId } = req.query;

      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 10;
      const offset = (pageNumber - 1) * limitNumber;

      const where = {};
      if (status) {
        where.status = status;
      }
      if (userId) {
        where.userId = userId;
      }

      const totalItems = await Order.count({ where });

      if (totalItems === 0) {
        return res.status(404).json({ error: 'Nenhum pedido encontrado.' });
      }

      const orders = await Order.findAll({
        where,
        include: [
          {
            model: OrderItem,
            include: [
              {
                model: Product,
                attributes: ['id', 'name'],
                include: [
                  {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['url']
                  }
                ]
              }
            ]
          },
          { model: User, attributes: ['id', 'name', 'email' ] }
        ],
        limit: limitNumber,
        offset,
        order: [['createdAt', 'DESC']]
      });

      const totalPages = Math.ceil(totalItems / limitNumber);

      const formattedOrders = orders.map(order => ({
        id: order.id,
        userId: order.userId,
        userName: order.User?.name,
        userEmail: order.User?.email,
        status: order.status,
        total: order.total,
        fullAddress: order.fullAddress,
        createdAt: order.createdAt,
        products: order.OrderItems.map(oi => ({
          productId: oi.productId,
          name: oi.Product?.name,
          quantity: oi.quantity,
          unitPrice: oi.unitPrice,
          subtotal: oi.subtotal,
          images: oi.Product?.images?.map(img => ({
            url: img.url
          })) || []
        }))
      }));

      res.status(200).json({
        page: pageNumber,
        limit: limitNumber,
        totalItems,
        totalPages,
        items: formattedOrders
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno: ' + error });
    }
  },

  async cancelOrder(req, res) {
    try {
      const orderId = req.params.id;
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }
      order.update({ status: 'canceled' });
      res.status(200).json({ message: 'Pedido cancelado com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno' });
    }
  },

  async shipOrder(req, res) {
    try {
      const orderId = req.params.id;
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }
      if (order.status !== 'placed') {
        return res.status(400).json({ error: 'Apenas pedidos com status "placed" podem ser marcados como "shipped".' });
      }
      await order.update({ status: 'shipped' });
      res.status(200).json({ message: 'Pedido marcado como "shipped" com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno' });
    }
  },

  async deliverOrder(req, res) {
    try {
      const orderId = req.params.id;
      const order = await Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }
      if (order.status !== 'shipped') {
        return res.status(400).json({ error: 'Apenas pedidos com status "shipped" podem ser marcados como "delivered".' });
      }
      await order.update({ status: 'delivered' });
      res.status(200).json({ message: 'Pedido marcado como "delivered" com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno' });
    }
  }
};
