import React, { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
import Hero from '../components/Hero';

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setErro(null);
        const produtosData = await api.listProdutos();
        setProdutos(produtosData);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        setErro("Não foi possível carregar os produtos.");
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Carregando produtos...</div>;

  if (erro)
    return (
    <div>
      <Hero />
        <div className="container py-12 text-center text-red-600">
          {erro}
        </div>
      </div>
    );

  return (
    <div>
      <Hero />
      <div className="bg-blue-50 min-h-screen py-10 px-6">

        {/* Grid de produtos */}
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-deepsea mb-6">Produtos</h1>
          {produtos.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Nenhum produto disponível</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {produtos.map((p) => (
                <ProductCard key={p.id} produto={p} onAdd={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}