const { getDashboard } = require('../controllers/adminDashboardController');
const { Order, Product, OrderItem } = require('../models');

jest.mock('../models', () => ({
  Order: {
    findAll: jest.fn(),
    findOne: jest.fn(),
  },
  Product: {
    findAll: jest.fn(),
  },
  OrderItem: {
    findOne: jest.fn(),
  },
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Admin Dashboard Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = { user: { id: 1 } };
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('getDashboard', () => {
    it('deve retornar dados do dashboard com sucesso', async () => {
      Order.findAll.mockResolvedValue([
        { id: 1, createdAt: new Date(), total: 100.50 },
        { id: 2, createdAt: new Date(), total: 200.75 }
      ]);

      Order.findOne.mockResolvedValue({
        dataValues: {
          totalSales: 301.25,
          totalOrders: 2
        }
      });

      OrderItem.findOne.mockResolvedValue({
        Product: {
          id: 1,
          name: 'Produto Mais Vendido',
          price: 50.00
        },
        dataValues: {
          totalSold: 10
        }
      });

      Product.findAll.mockResolvedValue([
        { id: 1, name: 'Produto A', quantity: 2 },
        { id: 2, name: 'Produto B', quantity: 1 }
      ]);

      await getDashboard(req, res);

      expect(Order.findAll).toHaveBeenCalledWith({
        where: { status: "delivered" },
        attributes: ["id", "createdAt", "total"],
        raw: true
      });

      expect(Order.findOne).toHaveBeenCalled();
      expect(OrderItem.findOne).toHaveBeenCalled();
      expect(Product.findAll).toHaveBeenCalled();

      expect(res.json).toHaveBeenCalledWith({
        topSellingProduct: {
          id: 1,
          name: 'Produto Mais Vendido',
          totalSold: 10
        },
        lowStockProducts: [
          { id: 1, name: 'Produto A', quantity: 2 },
          { id: 2, name: 'Produto B', quantity: 1 }
        ],
        salesSummary: {
          dataValues: {
            totalSales: 301.25,
            totalOrders: 2
          }
        }
      });
    });

    it('deve retornar topSellingProduct como null quando não há produtos vendidos', async () => {
      Order.findAll.mockResolvedValue([]);
      Order.findOne.mockResolvedValue({
        dataValues: {
          totalSales: 0,
          totalOrders: 0
        }
      });
      OrderItem.findOne.mockResolvedValue(null);
      Product.findAll.mockResolvedValue([]);

      await getDashboard(req, res);

      expect(res.json).toHaveBeenCalledWith({
        topSellingProduct: null,
        lowStockProducts: [],
        salesSummary: {
          dataValues: {
            totalSales: 0,
            totalOrders: 0
          }
        }
      });
    });

    it('deve retornar array vazio para lowStockProducts quando não há produtos com estoque baixo', async () => {
      Order.findAll.mockResolvedValue([]);
      Order.findOne.mockResolvedValue({
        dataValues: {
          totalSales: 0,
          totalOrders: 0
        }
      });
      OrderItem.findOne.mockResolvedValue(null);
      Product.findAll.mockResolvedValue([]);

      await getDashboard(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        lowStockProducts: []
      }));
    });

    it('deve retornar erro 500 quando Order.findAll falha', async () => {
      const errorMessage = 'Erro na consulta de pedidos';
      Order.findAll.mockRejectedValue(new Error(errorMessage));

      await getDashboard(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao gerar dashboard",
        details: errorMessage,
      });
    });

    it('deve retornar erro 500 quando Order.findOne (salesSummary) falha', async () => {
      Order.findAll.mockResolvedValue([]);
      const errorMessage = 'Erro na consulta de resumo de vendas';
      Order.findOne.mockRejectedValue(new Error(errorMessage));

      await getDashboard(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao gerar dashboard",
        details: errorMessage,
      });
    });

    it('deve retornar erro 500 quando OrderItem.findOne falha', async () => {
      Order.findAll.mockResolvedValue([]);
      Order.findOne.mockResolvedValue({
        dataValues: { totalSales: 0, totalOrders: 0 }
      });
      const errorMessage = 'Erro na consulta de produto mais vendido';
      OrderItem.findOne.mockRejectedValue(new Error(errorMessage));

      await getDashboard(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao gerar dashboard",
        details: errorMessage,
      });
    });

    it('deve retornar erro 500 quando Product.findAll falha', async () => {
      Order.findAll.mockResolvedValue([]);
      Order.findOne.mockResolvedValue({
        dataValues: { totalSales: 0, totalOrders: 0 }
      });
      OrderItem.findOne.mockResolvedValue(null);
      const errorMessage = 'Erro na consulta de produtos com estoque baixo';
      Product.findAll.mockRejectedValue(new Error(errorMessage));

      await getDashboard(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Erro ao gerar dashboard",
        details: errorMessage,
      });
    });

    it('deve processar corretamente dados reais do salesSummary', async () => {
      Order.findAll.mockResolvedValue([]);
      Order.findOne.mockResolvedValue({
        dataValues: {
          totalSales: "1500.50",
          totalOrders: "5"
        }
      });
      OrderItem.findOne.mockResolvedValue(null);
      Product.findAll.mockResolvedValue([]);

      await getDashboard(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        salesSummary: {
          dataValues: {
            totalSales: "1500.50",
            totalOrders: "5"
          }
        }
      }));
    });

    it('deve processar corretamente dados do topSellingProduct com totalSold como string', async () => {
      Order.findAll.mockResolvedValue([]);
      Order.findOne.mockResolvedValue({
        dataValues: { totalSales: 0, totalOrders: 0 }
      });
      OrderItem.findOne.mockResolvedValue({
        Product: {
          id: 1,
          name: 'Produto Top',
          price: 99.99
        },
        dataValues: {
          totalSold: "25"
        }
      });
      Product.findAll.mockResolvedValue([]);

      await getDashboard(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        topSellingProduct: {
          id: 1,
          name: 'Produto Top',
          totalSold: "25"
        }
      }));
    });
  });
});
