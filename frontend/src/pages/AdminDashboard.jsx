import React, { useEffect, useState } from "react";
import {
  listProdutos,
  createProduto,
  updateProduto,
  deleteProduto,
  listPedidos,
  cancelPedido,
  shipPedido,
  deliverPedido,
  getSupplier,
  listSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/PrivateRoute";
import toast from "react-hot-toast";
import CustomForm from "../components/CustomForm";
import CustomListGrid from "../components/CustomListGrid";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productPage, setProductPage] = useState(1);
  const [productTotalPages, setProductTotalPages] = useState(1);

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierPage, setSupplierPage] = useState(1);
  const [supplierTotalPages, setSupplierTotalPages] = useState(1);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);

  async function loadProducts(p = 1) {
    try {
      const res = await listProdutos({ page: p, limit: 6 });
      const payload = res.data ?? res;
      setProducts(payload.items ?? []);
      setProductPage(payload.page ?? p);
      setProductTotalPages(payload.totalPages ?? 1);
    } catch {
      toast.error("Erro ao carregar produtos");
    }
  }

  async function handleSaveProduct(prod) {
    try {
      const productPayload = {
        name: prod.name,
        description: prod.description,
        price: Number(prod.price),
        quantity: Number(prod.quantity),
        images: prod.images,
      };

      if (prod.id) {
        await updateProduto(prod.id, productPayload);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createProduto(productPayload);
        toast.success("Produto criado com sucesso!");
      }
      setSelectedProduct(null);
      loadProducts();
    } catch {
      toast.error("Erro ao salvar produto");
    }
  }

  async function handleDeleteProduct(id) {
    if (!confirm("Excluir?")) return;
    try {
      await deleteProduto(id);
      loadProducts();
    } catch {
      toast.error("Erro ao excluir produto");
    }
  }

  async function loadOrders(p = 1) {
    setLoadingOrders(true);
    try {
      const res = await listPedidos({ page: p, limit: 5 });
      const payload = res.data ?? res;
      const items = payload.items ?? payload.rows ?? payload.data ?? [];

      setOrders(items);
      setOrderTotalPages(
        payload.totalPages ??
        Math.ceil((payload.totalItems ?? items.length) / (payload.limit ?? 5))
      );
      setOrderPage(payload.page ?? p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  }

  async function handleCancelOrder(id) {
    try {
      await cancelPedido(id);
      toast.success("Pedido cancelado com sucesso!");
      loadOrders();
    } catch {
      toast.error("Erro ao cancelar pedido");
    }
  }

  async function handleShipOrder(id) {
    try {
      await shipPedido(id);
      toast.success("Pedido marcado como enviado!");
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao enviar pedido");
    }
  }

  async function handleDeliverOrder(id) {
    try {
      await deliverPedido(id);
      toast.success("Pedido marcado como entregue!");
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao entregar pedido");
    }
  }

  async function loadSuppliers(p = 1) {
  try {
    const res = await listSuppliers({ page: p, limit: 6 });
    const payload = res.data ?? res;
    setSuppliers(payload.items ?? []);
    setSupplierPage(payload.page ?? p);
    setSupplierTotalPages(payload.totalPages ?? 1);
  } catch (err) {
    console.error(err);
    toast.error("Erro ao carregar fornecedores");
  }
}

  async function handleSaveSupplier(supplier) {
    try {
      const payload = {
        name: supplier.name,
        email: supplier.email,
        cnpj: supplier.cnpj,
        phone: supplier.phone,
        website: supplier.website,
      };

      if (supplier.id) {
        await updateSupplier(supplier.id, payload);
        toast.success("Fornecedor atualizado com sucesso!");
      } else {
        await createSupplier(payload);
        toast.success("Fornecedor criado com sucesso!");
      }
      setSelectedSupplier(null);
      loadSuppliers();
    } catch {
      toast.error("Erro ao salvar fornecedor");
    }
  }

  async function handleDeleteSupplier(id) {
    if (!confirm("Excluir fornecedor?")) return;
    try {
      await deleteSupplier(id);
      loadSuppliers();
    } catch {
      toast.error("Erro ao excluir fornecedor");
    }
  }



  useEffect(() => {
    if (user?.userType === "admin") {
      loadProducts();
      loadSuppliers();
      loadOrders();
    }
  }, [user]);

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="container mx-auto py-12 px-6 space-y-16">
        <h1 className="text-4xl font-bold text-center md:text-left">
          Painel Administrativo
        </h1>

        <div className="flex flex-col md:flex-row gap-12">
          <section className="md:w-1/2 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">
              {selectedProduct ? "Editar produto" : "Novo produto"}
            </h2>
            <CustomForm
              current={selectedProduct}
              onSave={handleSaveProduct}
              onCancel={() => setSelectedProduct(null)}
              fields={[
                { name: "name", type: "text", label: "Nome" },
                { name: "price", type: "number", label: "Preço" },
                { name: "quantity", type: "number", label: "Quantidade" },
                { name: "images", type: "array", label: "Imagens" },
                { name: "description", type: "textarea", label: "Descrição" },
              ]}
            />
          </section>

          <section className="md:flex-2 rounded-xl shadow-lg">
            <CustomListGrid
              title="Produtos"
              items={products.map((p) => ({
                id: p.id,
                itemTitle: p.name,
                text1: `R$ ${Number(p.price).toFixed(2)}`,
                text2: `Estoque: ${p.quantity}`,
                image: p.images?.[0]?.url || null,
              }))}
              rawItems={products}
              onEdit={(id) => {
                const prod = products.find(p => p.id === id);
                setSelectedProduct(prod);
              }}
              onDelete={(id) => handleDeleteProduct(id)}
              page={productPage}
              totalPages={productTotalPages}
              onPrevPage={() => loadProducts(productPage - 1)}
              onNextPage={() => loadProducts(productPage + 1)}
            />
          </section>
        </div>


        <div className="flex flex-col md:flex-row gap-12">
          <section className=" md:w-1/2 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">
              {selectedSupplier ? "Editar fornecedor" : "Novo fornecedor"}
            </h2>
            <CustomForm
              current={selectedSupplier}
              onSave={handleSaveSupplier}
              onCancel={() => setSelectedSupplier(null)}
              fields={[
                { name: "name", type: "text", label: "Nome" },
                { name: "email", type: "text", label: "Email" },
                { name: "cnpj", type: "text", label: "CNPJ" },
                { name: "phone", type: "text", label: "Telefone" },
                { name: "website", type: "text", label: "Website" },
              ]}
            />
          </section>

          <section className="md:flex-2 rounded-xl shadow-lg flex flex-row flex-wrap flex-grow">
            <CustomListGrid
              title="Fornecedores"
              items={suppliers.map((s) => ({
                id: s.id,
                itemTitle: s.name,
                text1: s.email,
                text2: s.phone,
              }))}
              rawItems={suppliers}
              onEdit={(id) => {
                const supplier = suppliers.find((s) => s.id === id);
                setSelectedSupplier(supplier);
              }}
              onDelete={(id) => handleDeleteSupplier(id)}
              page={supplierPage}
              totalPages={supplierTotalPages}
              onPrevPage={() => loadSuppliers(supplierPage - 1)}
              onNextPage={() => loadSuppliers(supplierPage + 1)}
            />
          </section>
        </div>

        <section className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Pedidos Recentes
          </h2>
          {loadingOrders ? (
            <p className="text-center text-gray-500 py-12 text-lg select-none">
              Carregando...
            </p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-400 py-12 italic select-none">
              Nenhum pedido encontrado
            </p>
          ) : (
            <>
              <div className="space-y-6">
                {orders.map((o) => (
                  <article
                    key={o.id}
                    className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
                    aria-label={`Pedido número ${o.id}`}
                  >
                    <header className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-sea">#{o.id}</h3>
                      <time
                        dateTime={new Date(o.createdAt).toISOString()}
                        className="text-sm text-gray-500 italic"
                      >
                        {new Date(o.createdAt).toLocaleString()}
                      </time>
                    </header>
                    <p className="mb-2 text-gray-700 font-medium">
                      Usuário:{" "}
                      <span className="text-gray-900 font-semibold">
                        {o.userId} - {o.userName}
                      </span>
                    </p>
                    <p className="mb-2 text-gray-700 font-medium">
                      Endereço:{" "}
                      <span className="text-gray-900 font-semibold">
                        {o.fullAddress}
                      </span>
                    </p>
                    <p className="mb-2 text-gray-700 font-medium">
                      Status:{" "}
                      <span className="text-gray-900 font-semibold">
                        {o.status}
                      </span>
                    </p>
                    <h4 className="mb-2 font-semibold text-gray-800">Itens:</h4>
                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                      {(o.products || []).map((it) => (
                        <div
                          key={`${o.id}-${it.productId}`}
                          className="flex items-center gap-4 border border-gray-200 rounded-xl p-3 bg-gray-50 shadow-sm"
                        >
                          <img
                            src={
                              it.images?.[0]?.url ||
                              it.image ||
                              "/src/images/placeholder.png"
                            }
                            alt={it.name}
                            className="w-16 h-16 object-cover rounded-lg shadow"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {it.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantidade: {it.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Preço unitário: R${" "}
                              {(it.unitPrice ?? it.price ?? 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-right font-extrabold text-sea text-lg">
                      Total: R$ {(o.total ?? 0).toFixed(2)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 justify-end">
                      {o.status !== "canceled" && (
                        <button
                          onClick={() => handleCancelOrder(o.id)}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-semibold"
                        >
                          Cancelar
                        </button>
                      )}
                      {o.status === "placed" && (
                        <button
                          onClick={() => handleShipOrder(o.id)}
                          className="px-4 py-2 rounded-lg bg-sea text-white hover:bg-sea transition text-sm font-semibold"
                        >
                          Enviar
                        </button>
                      )}
                      {o.status === "shipped" && (
                        <button
                          onClick={() => handleDeliverOrder(o.id)}
                          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition text-sm font-semibold"
                        >
                          Entregar
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => loadOrders(orderPage - 1)}
                  disabled={orderPage <= 1}
                  className={`px-6 py-3 rounded-lg border-2 font-semibold transition ${orderPage <= 1
                    ? "border-sea text-sea cursor-not-allowed opacity-50"
                    : "border-sea text-sea hover:bg-sea hover:text-white shadow-md"
                    }`}
                  aria-label="Página anterior"
                >
                  Anterior
                </button>
                <span className="font-semibold text-gray-700 text-lg select-none">
                  {orderPage} / {orderTotalPages}
                </span>
                <button
                  onClick={() => loadOrders(orderPage + 1)}
                  disabled={orderPage >= orderTotalPages}
                  className={`px-6 py-3 rounded-lg border-2 font-semibold transition ${orderPage >= orderTotalPages
                    ? "border-sea text-sea cursor-not-allowed opacity-50"
                    : "border-sea text-white bg-sea hover:bg-sea-hover shadow-md"
                    }`}
                  aria-label="Próxima página"
                >
                  Próxima
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
