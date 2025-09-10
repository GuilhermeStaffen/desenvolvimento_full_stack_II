import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../contexts/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getProduto(id);
        setProduto(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="p-8">Carregando...</div>;
  if (!produto) return <div className="p-8">Produto não encontrado.</div>;

  const imageSrc = produto.imagem
    ? (produto.imagem.startsWith("http") ? produto.imagem : `/src/images/${produto.imagem}`)
    : "/src/images/placeholder.png";

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-center">
          <img src={imageSrc} alt={produto.nome} className="object-contain h-96" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-deepsea">{produto.nome}</h1>
          <p className="mt-4 text-gray-700">{produto.descricao}</p>
          <div className="mt-6">
            <div className="text-3xl font-extrabold text-deepsea">R$ {Number(produto.preco).toFixed(2)}</div>
            <button onClick={() => addToCart(produto)} className="mt-4 btn bg-sea text-white">Adicionar ao carrinho</button>
          </div>
        </div>
      </div>
    </div>
  );
}
