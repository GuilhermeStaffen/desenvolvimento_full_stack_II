import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
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
        await props.onSave({ id: props.current?.id, name: "Fornecedor Editado" });
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
    {props.items.map(i => (
      <div key={i.id}>
        {i.itemTitle}
        {props.onEdit && (
          <button onClick={() => props.onEdit(i.id)}>Editar</button>
        )}
        {props.onDelete && (
          <button onClick={() => props.onDelete(i.id)}>Excluir</button>
        )}
      </div>
    ))}
  </div>
));

describe("ManagementSection", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ user: { userType: "admin" } });

    api.listProdutos.mockResolvedValue({
      items: [{ id: 1, name: "Produto 1" }],
      page: 1,
      totalPages: 1
    });
    api.listSuppliers.mockResolvedValue({
      items: [{ id: 1, name: "Fornecedor 1" }],
      page: 1,
      totalPages: 1
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza produtos e fornecedores", async () => {
    render(<ManagementSections />);
    await waitFor(() => screen.getByText("Produto 1"));
    expect(screen.getByText("Fornecedor 1")).toBeInTheDocument();
  });

  it("cria um fornecedor", async () => {
    api.createSupplier.mockResolvedValue({});
    render(<ManagementSections />);

    const saveButtons = await screen.findAllByText("Salvar");
    fireEvent.click(saveButtons[1]);

    await waitFor(() => expect(api.createSupplier).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith("Fornecedor criado com sucesso!");
  });

  it("edita um fornecedor existente", async () => {
    api.updateSupplier.mockResolvedValue({});
    render(<ManagementSections />);

    await waitFor(() => screen.getByText("Fornecedor 1"));

    const fornecedorSection = screen.getByText("Fornecedor 1").closest("div");
    const editButton = within(fornecedorSection).getByText("Editar");
    fireEvent.click(editButton);

    const saveButtons = await screen.findAllByText("Salvar");
    fireEvent.click(saveButtons[1]);

    await waitFor(() => expect(api.updateSupplier).toHaveBeenCalledWith(1, expect.any(Object)));
    expect(toast.success).toHaveBeenCalledWith("Fornecedor atualizado com sucesso!");
  });

  it("exclui um fornecedor", async () => {
    api.deleteSupplier.mockResolvedValue({});
    render(<ManagementSections />);

    await waitFor(() => screen.getByText("Fornecedor 1"));
    global.confirm = jest.fn(() => true);

    const fornecedorSection = screen.getByText("Fornecedor 1").closest("div");
    const deleteButton = within(fornecedorSection).getByText("Excluir");
    fireEvent.click(deleteButton);

    await waitFor(() => expect(api.deleteSupplier).toHaveBeenCalledWith(1));
  });
});
