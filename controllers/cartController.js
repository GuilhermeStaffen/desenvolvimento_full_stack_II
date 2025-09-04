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
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      if (product.quantity < quantity) {
        return res.status(400).json({ error: 'Item não possui estoque' });
      }

      let cartItem = await Cart.findOne({ where: { userId, productId } });

      if (cartItem) {
        const newQuantity = cartItem.quantity + quantity;

        if (product.quantity < newQuantity) {
          return res.status(400).json({ error: 'Item não possui estoque suficiente' });
        }

        await cartItem.update({ quantity: newQuantity });
      } else {
        cartItem = await Cart.create({
          userId,
          productId,
          quantity
        });
      }

      const items = await Cart.findAll({
        where: { userId },
        include: [{ model: Product, attributes: ['name', 'price', 'quantity'] }]
      });

      let total = 0;
      const formattedItems = items.map(i => {
        total += i.quantity * i.Product.price;
        return {
          productId: i.productId,
          name: i.Product.name,
          quantity: i.quantity,
          unitPrice: i.Product.price
        };
      });

      res.status(202).json({
        id: userId,
        userId,
        items: formattedItems,
        total
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno' });
    }
  }
};

module.exports = cartController;
