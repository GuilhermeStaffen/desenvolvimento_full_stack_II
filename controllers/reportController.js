const { Order, OrderItem, Product } = require('../models');

async function getSalesData(req, res) {
  try {
    // Busca pedidos com itens e produtos relacionados
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

    // Se não houver pedidos, retorna estrutura vazia
    if (!orders || orders.length === 0) {
      return res.json({
        summary: { totalSales: 0, totalProfit: 0, totalOrders: 0 },
        monthly: [],
        topProducts: [],
        orders: [],
      });
    }

    // Acumuladores
    let totalSales = 0;
    let totalProfit = 0;
    const monthlyMap = {}; // { '2025-10': 1234.56 }
    const productSales = {}; // { 'Isca X': 10 }

    // Map orders -> formato frontend
    const ordersForFrontend = orders.map(order => {
      // Sequelize por padrão coloca os includes no plural 'OrderItems'
      const items = (order.OrderItems || order.order_items || order.products || []).map(item => {
        const product = item.Product || {};
        const quantidade = Number(item.quantity || 0);
        // prefer subtotal se presente, senão unitPrice * quantidade
        const unitPrice = item.unitPrice != null ? Number(item.unitPrice) : (product.price != null ? Number(product.price) : 0);
        const subtotal = item.subtotal != null ? Number(item.subtotal) : unitPrice * quantidade;
        const costPrice = product.costPrice != null ? Number(product.costPrice) : 0;

        // acumula por produto (topProducts)
        const nome = product.name || `produto-${product.id || item.productId || 'unknown'}`;
        productSales[nome] = (productSales[nome] || 0) + quantidade;

        return {
          produto: nome,
          quantidade,
          precoUnitario: unitPrice,
          custoUnitario: costPrice,
          subtotal,
        };
      });

      // soma valor venda e custo total
      const valorVenda = items.reduce((s, it) => s + (Number(it.precoUnitario || 0) * Number(it.quantidade || 0)), 0);
      const custoTotal = items.reduce((s, it) => s + (Number(it.custoUnitario || 0) * Number(it.quantidade || 0)), 0);
      const lucro = valorVenda - custoTotal;

      totalSales += valorVenda;
      totalProfit += lucro;

      // monthly key YYYY-MM
      const createdAt = order.createdAt || new Date();
      const monthKey = createdAt.toISOString().slice(0, 7);
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + valorVenda;

      return {
        id: order.id != null ? String(order.id) : (new Date(createdAt).getTime()).toString(),
        data: createdAt.toISOString(),
        status: order.status || 'placed',
        itens: items,
        valorVenda,
        lucro,
      };
    });

    // Constrói monthly array ordenado por month asc
    const monthly = Object.entries(monthlyMap)
      .map(([month, value]) => ({ month, value }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Top products por quantidade
    const topProducts = Object.entries(productSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    const summary = {
      totalSales,
      totalProfit,
      totalOrders: ordersForFrontend.length,
    };

    return res.json({
      summary,
      monthly,
      topProducts,
      orders: ordersForFrontend,
    });
  } catch (error) {
    console.error("Erro ao buscar dados de vendas para relatório:", error);
    return res.status(500).json({ message: "Erro ao gerar relatório", error: error.message });
  }
}

module.exports = { getSalesData };
