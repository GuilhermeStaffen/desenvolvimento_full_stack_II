import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import * as api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user, loading } = useAuth();
  const nav = useNavigate();

  async function handleConfirmarPedido() {
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.id,
          quantity: Number(i.quantidade ?? i.quantity ?? 1),
        })),
      };

      await api.createPedido(payload);
      clearCart();
      toast.success("Pedido realizado com sucesso!");
      nav("/meus-pedidos");
    } catch (err) {
      console.error("Erro ao confirmar pedido:", err);
      toast.error(err.response?.data?.message || "Erro ao confirmar pedido");
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-8 py-16 bg-white rounded-3xl shadow-xl">
      <h2 className="text-4xl font-extrabold mb-12 text-gray-900 text-center tracking-wide">
        Finalizar Compra
      </h2>

      {/* Resumo do Pedido */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-300 pb-2">
          Resumo do Pedido
        </h3>
        {items.length === 0 ? (
          <p className="text-center text-gray-600">Seu carrinho está vazio.</p>
        ) : (
          <div className="space-y-6">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex flex-col md:flex-row md:justify-between md:items-center p-6 border border-gray-200 rounded-3xl shadow-sm hover:shadow-lg transition gap-6 bg-gradient-to-tr from-white to-gray-50"
              >
                <div className="flex items-center gap-6">
                  <img
                    src={it.images?.[0]?.url || "/src/images/placeholder.png"}
                    alt={it.name}
                    className="w-28 h-28 md:w-20 md:h-20 object-cover rounded-2xl shadow"
                  />
                  <div>
                    <div className="font-semibold text-2xl md:text-lg text-gray-900">
                      {it.name}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      R$ {Number(it.preco ?? it.price).toFixed(2)}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      Quantidade: {it.quantidade ?? it.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-bold text-xl text-sea text-right">
                  Subtotal: R${" "}
                  {(
                    (it.preco ?? it.price) * (it.quantidade ?? it.quantity)
                  ).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-right mt-6 text-2xl font-extrabold text-sea">
          Total: R$ {total.toFixed(2)}
        </p>
      </section>

      {/* Endereço do Cliente */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-300 pb-2">
          Endereço de Entrega
        </h3>
        {user ? (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-gray-900 font-medium">{user.name}</p>
            <p className="text-gray-700">
              {user.street}, {user.number}
            </p>
            <p className="text-gray-700">
              {user.city} - {user.state}, {user.zipcode}
            </p>
            <p className="text-gray-700">{user.country}</p>
          </div>
        ) : (
          <p className="text-gray-600">Carregando dados do cliente...</p>
        )}
      </section>

      {/* Botão Confirmar */}
      <button
        onClick={handleConfirmarPedido}
        disabled={loading || items.length === 0}
        className={`w-full py-4 rounded-xl text-white font-semibold ${
          loading || items.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-sea hover:bg-sea-hover"
        } shadow-lg transition`}
      >
        {loading ? "Finalizando..." : "Confirmar Pedido"}
      </button>
    </div>
  );
}
