import React, { useEffect, useState } from "react";
import { listMyOrders } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const nav = useNavigate();

  async function loadOrders(p = 1) {
    setLoading(true);
    try {
      const res = await listMyOrders({ page: p, limit: 5 });
      const payload = res.data ?? res;
      setOrders(payload.items ?? []);
      setOrderPage(payload.page ?? 1);
      setOrderTotalPages(payload.totalPages ?? 1);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
    loadOrders(1);
  }, [user]);

  return (
    <div className="container mx-auto max-w-5xl px-8 py-16">
      <section className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold mb-12 text-gray-900 text-center tracking-wide">
          Meus Pedidos
        </h2>

        {loading ? (
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
                    Total: R$ {(o.total ?? o.totalPrice ?? 0).toFixed(2)}
                  </p>
                </article>
              ))}
            </div>

            {/* Paginação */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => loadOrders(orderPage - 1)}
                disabled={orderPage <= 1}
                className={`px-6 py-3 rounded-lg border-2 font-semibold transition ${
                  orderPage <= 1
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
                className={`px-6 py-3 rounded-lg border-2 font-semibold transition ${
                  orderPage >= orderTotalPages
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
  );
}
