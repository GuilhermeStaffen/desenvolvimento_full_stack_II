const { Op, sequelize, fn, col, literal } = require("sequelize");
const { Order, Product, OrderItem } = require("../models");

async function getDashboard(req, res) {
  try {
    // Define o intervalo de datas (mês atual)
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    
    const summaryResult = await Order.findOne({
      attributes: [
        [fn("SUM", col("Order.total")), "totalVendas"],
        [fn("COUNT", col("Order.id")), "numeroVendas"],
      ],
      // Filtro para vendas concluídas e dentro do mês
      where: {
        status: "delivered", // Apenas pedidos entregues são vendas concluídas
        createdAt: { 
          [Op.between]: [startOfMonth, endOfMonth] 
        },
      },
    });

    //Produto mais vendido (usando OrderItem)
    const produtoMaisVendido = await OrderItem.findOne({
      attributes: [
        "productId",
        [fn("SUM", col("OrderItem.quantity")), "totalVendido"],
      ],
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price"],
        },
      ],
      group: ["OrderItem.productId"],
      order: [[literal("totalVendido"), "DESC"]],
      limit: 1,
    });

    // Produtos com baixo estoque
    const produtosBaixoEstoque = await Product.findAll({
      where: { quantity: { [Op.lt]: 5 } },
      attributes: ["id", "name", "quantity"],
      order: [["quantity", "ASC"]],
      limit: 5,
    });

    return res.json({
      produtoMaisVendido: produtoMaisVendido
        ? {
            id: produtoMaisVendido.Product.id,
            name: produtoMaisVendido.Product.name,
            totalVendido: produtoMaisVendido.dataValues.totalVendido,
          }
        : null,
      produtosBaixoEstoque,
      summaryResult,
    });
  } catch (error) {
    console.error("Erro ao gerar dashboard:", error);
    res.status(500).json({ error: "Erro ao gerar dashboard", details: error.message });
  }
}

module.exports = { getDashboard };
