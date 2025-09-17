import React from "react";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const nav = useNavigate();

  return (
    <div className="container mx-auto max-w-5xl px-8 py-16 bg-white rounded-3xl shadow-xl">
      <h2 className="text-4xl font-extrabold mb-12 text-gray-900 text-center tracking-wide">
        Meu Carrinho
      </h2>

      {items.length === 0 ? (
        <div className="text-center text-gray-400 py-20 text-xl italic select-none">
          Seu carrinho está vazio
        </div>
      ) : (
        <>
          <div className="space-y-8">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex flex-col md:flex-row md:justify-between md:items-center p-6 border border-gray-200 rounded-3xl shadow-sm hover:shadow-lg transition gap-6 bg-gradient-to-tr from-white to-gray-50"
              >
                <div className="flex items-center gap-6">
                  <img
                    src={it.image || "/src/assets/placeholder.png"}
                    alt={it.name}
                    className="w-28 h-28 md:w-20 md:h-20 object-cover rounded-2xl shadow"
                  />
                  <div>
                    <div className="font-semibold text-2xl md:text-lg text-gray-900">
                      {it.name}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">
                      R$ {Number(it.price).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <input
                    type="number"
                    min={1}
                    value={it.quantity}
                    onChange={(e) => updateQuantity(it.id, Number(e.target.value))}
                    className="w-24 border border-gray-300 rounded-xl px-4 py-2 text-center text-gray-900 focus:outline-none focus:ring-4 focus:ring-sea transition shadow"
                    aria-label={`Quantidade de ${it.name}`}
                  />
                  <div className="font-bold text-xl text-sea">
                    Subtotal: R$ {(it.price * it.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(it.id)}
                    className="bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-red-700 shadow-lg transition"
                    aria-label={`Remover ${it.name} do carrinho`}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-3xl font-extrabold text-sea tracking-tight">
              Total: R$ {total.toFixed(2)}
            </div>
            <div className="flex gap-6 w-full md:w-auto justify-center">
              <button
                onClick={() => nav("/")}
                className="flex-1 md:flex-none px-8 py-4 border-2 border-sea rounded-3xl text-sea font-semibold hover:bg-sea transition"
              >
                Continuar comprando
              </button>
              <button
                onClick={() => nav("/checkout")}
                className="flex-1 md:flex-none px-8 py-4 bg-sea text-white rounded-3xl font-semibold hover:from-sea shadow-lg transition"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
