import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as api from "../services/api";
import { useCart } from "../contexts/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const p = await api.getProduto(id);
        setProduto(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600 text-xl font-medium select-none">
        Carregando...
      </div>
    );
  if (!produto)
    return (
      <div className="text-center py-20 text-gray-600 text-xl font-medium italic select-none">
        Produto não encontrado
      </div>
    );

  return (
    <div className="container mx-auto px-6 py-12 bg-white rounded-3xl shadow-xl max-w-6xl">
      <div className="flex flex-col md:flex-row gap-12">
        <img
          src={produto.image || "/src/images/placeholder.png"}
          alt={produto.name}
          className="w-full md:w-96 h-96 object-cover rounded-2xl shadow-lg"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-extrabold mb-6 text-gray-900 tracking-wide">
              {produto.name}
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed text-lg">
              {produto.description}
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold mb-3 text-sea">
              R$ {Number(produto.price).toFixed(2)}
            </div>
            <div className="text-sm text-gray-500 mb-6 font-medium">
              Estoque disponível: {produto.quantity}
            </div>
            <button
              onClick={() => addToCart(produto)}
              className="bg-sea text-white px-8 py-4 rounded-3xl font-semibold shadow-lg hover:bg-sea-hover transition focus:outline-none focus:ring-4 focus:ring-sea focus:ring-opacity-60"
              aria-label={`Adicionar ${produto.name} ao carrinho`}
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
