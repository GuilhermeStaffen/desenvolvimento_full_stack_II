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

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);



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



 
  



  useEffect(() => {
    if (user?.userType === "admin") {
      loadOrders();
    }
  }, [user]);

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="container mx-auto py-12 px-6 space-y-16">
        <h1 className="text-4xl font-bold text-center md:text-left">
          Painel Administrativo
        </h1>


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
