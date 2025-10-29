import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import React from "react";
import ManagementSections from "../pages/ManagementSections";
import * as api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

jest.mock('../services/api', () => ({
  listProdutos: jest.fn(),
  createProduto: jest.fn(),
  updateProduto: jest.fn(),
  deleteProduto: jest.fn(),
  listSuppliers: jest.fn(),
  createSupplier: jest.fn(),
  updateSupplier: jest.fn(),
  deleteSupplier: jest.fn(),
}));
jest.mock("../components/CustomForm", () => (props) => (
  <div data-testid="custom-form">
    <button
      onClick={async () => {
        await props.onSave({ name: "Produto Test", price: 10, quantity: 1 });
      }}
    >
      Salvar
    </button>
  </div>
));
jest.mock("../contexts/AuthContext");
jest.mock("react-hot-toast", () => ({ success: jest.fn(), error: jest.fn() }));
jest.mock("../components/CustomListGrid", () => (props) => (
  <div data-testid="custom-list-grid">
    {props.items.map(i => <div key={i.id}>{i.itemTitle}</div>)}
  </div>
));

describe("ManagementSection", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: { userType: "admin" } });
    api.listProdutos.mockResolvedValue({ items: [{ id: 1, name: "Produto 1" }], page: 1, totalPages: 1 });
    api.listSuppliers.mockResolvedValue({ items: [{ id: 1, name: "Fornecedor 1" }], page: 1, totalPages: 1 });
  });

  it("renderiza produtos e fornecedores", async () => {
    render(<ManagementSections />);
    await waitFor(() => screen.getByText("Produto 1"));
    expect(screen.getByText("Fornecedor 1")).toBeInTheDocument();
  });

  it("salva um produto", async () => {
    api.createProduto.mockResolvedValue({});
    render(<ManagementSections />);

    const saveButtons = await screen.findAllByText("Salvar");
    fireEvent.click(saveButtons[0]);

    await waitFor(() => expect(api.createProduto).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith("Produto criado com sucesso!");
  });
});
