import React, { useEffect, useState } from "react";
import { listMyOrders } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
    async function load() {
      setLoading(true);
      try {
        const res = await listMyOrders({ page: 1, limit: 20 });
        const payload = res.data ?? res;
        const items = payload.items ?? payload.rows ?? payload.data ?? [];
        setOrders(items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <div className="container mx-auto max-w-5xl px-8 py-16 bg-white rounded-3xl shadow-lg">
      <h2 className="text-4xl font-extrabold mb-12 text-gray-900 text-center tracking-wide">
        Meus Pedidos
      </h2>

      {loading ? (
        <div className="text-center text-gray-500 py-12 text-xl font-medium" role="status" aria-live="polite">
          Carregando...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-400 py-12 text-xl font-medium italic">
          Nenhum pedido encontrado
        </div>
      ) : (
        <div className="space-y-10">
          {orders.map((o) => (
            <div
              key={o.id}
              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition"
              aria-label={`Pedido número ${o.id}`}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="text-xl font-semibold text-sea">
                  Pedido #{o.id}
                </div>
                <time
                  dateTime={new Date(o.createdAt).toISOString()}
                  className="text-sm text-gray-500 italic"
                >
                  {new Date(o.createdAt).toLocaleString()}
                </time>
              </div>
              <ul className="divide-y divide-gray-300 mb-6">
                {(o.items || []).map((it) => (
                  <li key={`${o.id}-${it.productId}`} className="py-3 flex justify-between text-gray-700 font-medium">
                    <span>{it.name} <span className="text-gray-500">x{it.quantity}</span></span>
                    <span>R$ {(it.unitPrice ?? it.price ?? 0).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="text-right font-extrabold text-2xl text-sea">
                Total: R$ {(o.total ?? o.totalPrice ?? 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
