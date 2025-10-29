const { Op, fn, col, literal } = require("sequelize");
const { Order, Product, OrderItem } = require("../models");

async function getDashboard(req, res) {
  try {

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);


    const salesSummary = await Order.findOne({
      attributes: [
        [fn("SUM", col("Order.total")), "totalSales"],
        [fn("COUNT", col("Order.id")), "totalOrders"],
      ],
      where: {
        status: "delivered",
        
        createdAt: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });

    const topSellingProduct = await OrderItem.findOne({
      attributes: [
        "productId",
        [fn("SUM", col("OrderItem.quantity")), "totalSold"],
      ],
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price"],
        },
      ],
      group: ["OrderItem.productId"],
      order: [[literal("totalSold"), "DESC"]],
      limit: 1,
    });

    const lowStockProducts = await Product.findAll({
      where: { quantity: { [Op.lt]: 5 } },
      attributes: ["id", "name", "quantity"],
      order: [["quantity", "ASC"]],
      limit: 5,
    });

    return res.json({
      topSellingProduct: topSellingProduct
        ? {
            id: topSellingProduct.Product.id,
            name: topSellingProduct.Product.name,
            totalSold: topSellingProduct.dataValues.totalSold,
          }
        : null,
      lowStockProducts,
      salesSummary,
    });
  } catch (error) {
    console.error("Erro ao gerar dashboard:", error);
    res.status(500).json({
      error: "Erro ao gerar dashboard",
      details: error.message,
    });
  }
}

module.exports = { getDashboard };
