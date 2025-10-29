const { Op, fn, col, literal, where } = require("sequelize");
const { Order, Product, OrderItem } = require("../models");

async function getDashboard(req, res) {
  try {
    const today = new Date();
    const startOfMonth = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999));


    const orders = await Order.findAll({
      where: { status: "delivered" },
      attributes: ["id", "createdAt", "total"],
      raw: true
    });

    const salesSummary = await Order.findOne({
      attributes: [
        [fn("SUM", col("total")), "totalSales"],
        [fn("COUNT", col("id")), "totalOrders"],
      ],
      where: literal(`status = 'delivered' AND date(createdAt) BETWEEN '${startOfMonth.toISOString().split('T')[0]}' AND '${endOfMonth.toISOString().split('T')[0]}'`)

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
