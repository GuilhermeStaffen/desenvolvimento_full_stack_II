const { Order, OrderItem, Product } = require('../models');

async function getSalesData(req, res) {
  try {
    // Fetch orders with related items and products
    const orders = await Order.findAll({
      attributes: ['id', 'createdAt', 'status'],
      include: [
        {
          model: OrderItem,
          attributes: ['id', 'quantity', 'unitPrice', 'subtotal', 'productId'],
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'price', 'costPrice'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // If there are no orders, return empty structure
    if (!orders || orders.length === 0) {
      return res.json({
        summary: { totalSales: 0, totalProfit: 0, totalOrders: 0 },
        monthly: [],
        topProducts: [],
        orders: [],
      });
    }

    // Accumulators
    let totalSales = 0;
    let totalProfit = 0;
    const monthlySalesMap = {}; // { '2025-10': 1234.56 }
    const productQuantities = {}; // { 'Product X': 10 }

    // Map orders -> frontend format
    const formattedOrders = orders.map(order => {
      // Sequelize often returns includes as pluralized names
      const items = (order.OrderItems || order.order_items || order.products || []).map(item => {
        const product = item.Product || {};
        const quantity = Number(item.quantity || 0);
        // prefer subtotal if present, otherwise unitPrice * quantity
        const unitPrice = item.unitPrice != null
          ? Number(item.unitPrice)
          : (product.price != null ? Number(product.price) : 0);
        const subtotal = item.subtotal != null ? Number(item.subtotal) : unitPrice * quantity;
        const costPrice = product.costPrice != null ? Number(product.costPrice) : 0;

        // accumulate per product (for topProducts)
        const name = product.name || `product-${product.id || item.productId || 'unknown'}`;
        productQuantities[name] = (productQuantities[name] || 0) + quantity;

        return {
          product: name,
          quantity,
          unitPrice,
          costPrice,
          subtotal,
        };
      });

      // calculate total sale value and total cost
      const saleValue = items.reduce((sum, it) => sum + (Number(it.unitPrice || 0) * Number(it.quantity || 0)), 0);
      const totalCost = items.reduce((sum, it) => sum + (Number(it.costPrice || 0) * Number(it.quantity || 0)), 0);
      const profit = saleValue - totalCost;

      totalSales += saleValue;
      totalProfit += profit;

      // monthly key YYYY-MM
      const createdAt = order.createdAt || new Date();
      const monthKey = createdAt.toISOString().slice(0, 7);
      monthlySalesMap[monthKey] = (monthlySalesMap[monthKey] || 0) + saleValue;

      return {
        id: order.id != null ? String(order.id) : new Date(createdAt).getTime().toString(),
        date: createdAt.toISOString(),
        status: order.status || 'placed',
        items,
        saleValue,
        profit,
      };
    });

    // Build monthly array sorted ascending by month
    const monthly = Object.entries(monthlySalesMap)
      .map(([month, value]) => ({ month, value }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Top products by quantity
    const topProducts = Object.entries(productQuantities)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    const summary = {
      totalSales,
      totalProfit,
      totalOrders: formattedOrders.length,
    };

    return res.json({
      summary,
      monthly,
      topProducts,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching sales data for report:", error);
    return res.status(500).json({ message: "Error generating report", error: error.message });
  }
}

module.exports = { getSalesData };
