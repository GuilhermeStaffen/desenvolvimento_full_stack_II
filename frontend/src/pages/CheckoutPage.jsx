import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import * as api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { items, total, clearCart, syncFromBackend } = useCart();
  const [address, setAddress] = useState("");
  const [sending, setSending] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (!items || items.length === 0) {
      // redirect to cart if empty
      nav("/carrinho");
    }
  }, [items]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!address.trim()) {
      alert("Informe endereço");
      return;
    }
    setSending(true);
    try {
      const body = {
        items: items.map((i) => ({
          productId: i.id,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.price,
        })),
        address,
        total,
      };
      const res = await api.createPedido(body);
      if (res.status === 201 || res.status === 200) {
        alert("Pedido realizado");
        clearCart();
        await syncFromBackend();
        nav("/meus-pedidos");
      } else {
        alert("Pedido criado (status inesperado)");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message ?? "Erro ao finalizar pedido");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-6 py-12 bg-white rounded-2xl shadow-lg">
      <h2 className="text-4xl font-extrabold mb-8 text-gray-900 text-center">
        Finalizar Pedido
      </h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <textarea
          placeholder="Endereço de entrega"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="w-full min-h-[120px] border border-gray-300 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm resize-none"
        />
        <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Resumo</h3>
          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex justify-between text-gray-700 font-medium"
              >
                <div>
                  {it.name} <span className="text-gray-500">x{it.quantity}</span>
                </div>
                <div>R$ {(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div className="text-lg font-bold mt-6 border-t border-gray-300 pt-4 text-gray-900">
              Total: R$ {total.toFixed(2)}
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={sending}
          className={`w-full py-4 rounded-xl text-white font-semibold shadow-lg transition ${
            sending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-sea"
          }`}
        >
          {sending ? "Enviando..." : "Confirmar Pedido"}
        </button>
      </form>
    </div>
  );
}
