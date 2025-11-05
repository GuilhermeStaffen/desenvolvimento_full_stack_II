import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import React from "react";
import AdminDashboard from "../pages/AdminDashboard";
import * as api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

jest.mock('../services/api', () => ({
  listPedidos: jest.fn(),
  cancelPedido: jest.fn(),
  shipPedido: jest.fn(),
  deliverPedido: jest.fn(),
  getAdminDashboard: jest.fn(),
}));

jest.mock("../contexts/AuthContext");
jest.mock("react-hot-toast", () => ({ 
  success: jest.fn(), 
  error: jest.fn() 
}));

jest.mock("../components/PrivateRoute", () => ({ children, adminOnly }) => (
  <div data-testid="protected-route" data-admin-only={adminOnly}>
    {children}
  </div>
));

describe("AdminDashboard", () => {
  const mockDashboardData = {
    salesSummary: {
      totalSales: 1500.50,
      totalOrders: 5
    },
    topSellingProduct: {
      id: 1,
      name: "Produto Mais Vendido",
      totalSold: 25
    },
    lowStockProducts: [
      { id: 1, name: "Produto A", quantity: 2 },
      { id: 2, name: "Produto B", quantity: 1 }
    ]
  };

  const mockOrders = [
    {
      id: 1,
      createdAt: "2024-01-15T10:00:00Z",
      userId: 1,
      userName: "João Silva",
      fullAddress: "Rua A, 123 - São Paulo, SP",
      status: "placed",
      total: 299.99,
      products: [
        {
          productId: 1,
          name: "Produto Teste",
          quantity: 2,
          unitPrice: 149.99,
          images: [{ url: "/image1.jpg" }]
        }
      ]
    },
    {
      id: 2,
      createdAt: "2024-01-14T15:30:00Z",
      userId: 2,
      userName: "Maria Santos",
      fullAddress: "Av. B, 456 - Rio de Janeiro, RJ",
      status: "shipped",
      total: 150.00,
      products: [
        {
          productId: 2,
          name: "Outro Produto",
          quantity: 1,
          unitPrice: 150.00,
          images: [{ url: "/image2.jpg" }]
        }
      ]
    }
  ];

  beforeEach(() => {
    useAuth.mockReturnValue({ 
      user: { 
        id: 1, 
        userType: "admin" 
      } 
    });

    api.listPedidos.mockResolvedValue({
      items: mockOrders,
      page: 1,
      totalPages: 1,
      totalItems: 2,
      limit: 5
    });

    api.getAdminDashboard.mockResolvedValue(mockDashboardData);
    api.cancelPedido.mockResolvedValue({});
    api.shipPedido.mockResolvedValue({});
    api.deliverPedido.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza o painel administrativo corretamente", async () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText("Painel Administrativo")).toBeInTheDocument();
    expect(screen.getByText("Resumo do mês")).toBeInTheDocument();
    expect(screen.getByText("Pedidos Recentes")).toBeInTheDocument();
  });

  it("carrega e exibe dados do dashboard", async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(api.getAdminDashboard).toHaveBeenCalled();
    });

    expect(screen.getByText("Total de vendas do mês")).toBeInTheDocument();
    expect(screen.getByText("R$ 1.500,50")).toBeInTheDocument();
    expect(screen.getByText("(5 venda(s) realizada(s))")).toBeInTheDocument();

    expect(screen.getByText("Produto mais vendido")).toBeInTheDocument();
    expect(screen.getByText("Produto Mais Vendido")).toBeInTheDocument();
    expect(screen.getByText("(25 un. vendida(s))")).toBeInTheDocument();

    expect(screen.getByText("Itens com baixo estoque")).toBeInTheDocument();
    expect(screen.getByText("Produto A (2 un.)")).toBeInTheDocument();
    expect(screen.getByText("Produto B (1 un.)")).toBeInTheDocument();
  });

  it("carrega e exibe lista de pedidos", async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(api.listPedidos).toHaveBeenCalledWith({ page: 1, limit: 5 });
    });

    expect(screen.getByText("#1")).toBeInTheDocument();
    expect(screen.getByText("1 - João Silva")).toBeInTheDocument();
    expect(screen.getByText("Rua A, 123 - São Paulo, SP")).toBeInTheDocument();
    expect(screen.getByText("placed")).toBeInTheDocument();
    expect(screen.getByText("Total: R$ 299.99")).toBeInTheDocument();

    expect(screen.getByText("#2")).toBeInTheDocument();
    expect(screen.getByText("2 - Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("shipped")).toBeInTheDocument();
  });

  it("exibe mensagem quando não há pedidos", async () => {
    api.listPedidos.mockResolvedValue({
      items: [],
      page: 1,
      totalPages: 0,
      totalItems: 0,
      limit: 5
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Nenhum pedido encontrado")).toBeInTheDocument();
    });
  });

  it("cancela pedido com sucesso", async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("#1")).toBeInTheDocument();
    });

    const cancelButtons = screen.getAllByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButtons[0]);

    await waitFor(() => {
      expect(api.cancelPedido).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith("Pedido cancelado com sucesso!");
    });
  });

  it("marca pedido como enviado", async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("#1")).toBeInTheDocument();
    });

    const shipButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(shipButton);

    await waitFor(() => {
      expect(api.shipPedido).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith("Pedido marcado como enviado!");
    });
  });

  it("marca pedido como entregue", async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("#2")).toBeInTheDocument();
    });

    const deliverButton = screen.getByRole('button', { name: /entregar/i });
    fireEvent.click(deliverButton);

    await waitFor(() => {
      expect(api.deliverPedido).toHaveBeenCalledWith(2);
      expect(toast.success).toHaveBeenCalledWith("Pedido marcado como entregue!");
    });
  });

  it("exibe erro ao cancelar pedido", async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Não é possível cancelar este pedido"
        }
      }
    };
    api.cancelPedido.mockRejectedValue(errorResponse);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("#1")).toBeInTheDocument();
    });

    const cancelButtons = screen.getAllByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButtons[0]);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao cancelar pedido");
    });
  });

  it("exibe erro ao enviar pedido", async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Produto fora de estoque"
        }
      }
    };
    api.shipPedido.mockRejectedValue(errorResponse);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("#1")).toBeInTheDocument();
    });

    const shipButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(shipButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Produto fora de estoque");
    });
  });

  it("exibe erro ao entregar pedido", async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Pedido não pode ser entregue"
        }
      }
    };
    api.deliverPedido.mockRejectedValue(errorResponse);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("#2")).toBeInTheDocument();
    });

    const deliverButton = screen.getByRole('button', { name: /entregar/i });
    fireEvent.click(deliverButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Pedido não pode ser entregue");
    });
  });

  it("navega entre páginas de pedidos", async () => {
    api.listPedidos.mockResolvedValue({
      items: mockOrders,
      page: 1,
      totalPages: 3,
      totalItems: 15,
      limit: 5
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: /próxima página/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(api.listPedidos).toHaveBeenCalledWith({ page: 2, limit: 5 });
    });
  });

  it("desabilita botão anterior na primeira página", async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      const prevButton = screen.getByRole('button', { name: /página anterior/i });
      expect(prevButton).toBeDisabled();
    });
  });

  it("desabilita botão próxima na última página", async () => {
    api.listPedidos.mockResolvedValue({
      items: mockOrders,
      page: 3,
      totalPages: 3,
      totalItems: 15,
      limit: 5
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      const nextButton = screen.getByRole('button', { name: /próxima página/i });
      expect(nextButton).toBeDisabled();
    });
  });

  it("exibe estado de carregamento", () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText("Carregando dados...")).toBeInTheDocument();
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("exibe dashboard indisponível quando não há dados", async () => {
    api.getAdminDashboard.mockResolvedValue(null);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Dados do dashboard indisponíveis.")).toBeInTheDocument();
    });
  });

  it("exibe mensagem quando não há produto mais vendido", async () => {
    const dashboardWithoutTopProduct = {
      ...mockDashboardData,
      topSellingProduct: null
    };
    api.getAdminDashboard.mockResolvedValue(dashboardWithoutTopProduct);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Nenhum produto vendido")).toBeInTheDocument();
    });
  });

  it("exibe mensagem quando não há produtos com estoque baixo", async () => {
    const dashboardWithoutLowStock = {
      ...mockDashboardData,
      lowStockProducts: []
    };
    api.getAdminDashboard.mockResolvedValue(dashboardWithoutLowStock);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Sem produtos com estoque baixo")).toBeInTheDocument();
    });
  });

  it("limita exibição de produtos com estoque baixo a 3 itens", async () => {
    const dashboardWithManyLowStock = {
      ...mockDashboardData,
      lowStockProducts: [
        { id: 1, name: "Produto A", quantity: 1 },
        { id: 2, name: "Produto B", quantity: 2 },
        { id: 3, name: "Produto C", quantity: 3 },
        { id: 4, name: "Produto D", quantity: 4 },
        { id: 5, name: "Produto E", quantity: 1 }
      ]
    };
    api.getAdminDashboard.mockResolvedValue(dashboardWithManyLowStock);

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Produto A (1 un.)")).toBeInTheDocument();
      expect(screen.getByText("Produto B (2 un.)")).toBeInTheDocument();
      expect(screen.getByText("Produto C (3 un.)")).toBeInTheDocument();
      expect(screen.getByText("e mais 2 itens...")).toBeInTheDocument();
    });
  });

  it("não renderiza botões de ação para pedidos cancelados", async () => {
    const canceledOrder = {
      ...mockOrders[0],
      status: "canceled"
    };
    
    api.listPedidos.mockResolvedValue({
      items: [canceledOrder],
      page: 1,
      totalPages: 1
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("#1")).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /cancelar/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /enviar/i })).not.toBeInTheDocument();
    });
  });

  it("atualiza dashboard após ações nos pedidos", async () => {
    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("#1")).toBeInTheDocument();
    });

    const cancelButtons = screen.getAllByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButtons[0]);

    await waitFor(() => {
      expect(api.getAdminDashboard).toHaveBeenCalledTimes(2);
    });
  });
});