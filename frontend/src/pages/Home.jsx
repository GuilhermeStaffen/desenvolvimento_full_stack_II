import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import * as api from "../services/api";
import { useCart } from "../contexts/CartContext";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  // async function load(p = 1, query = "") {
  //   setLoading(true);
  //   try {
  //     const res = await api.listProdutos({ page: p, limit: 9, q: query });
  //     setProdutos(res.items);
  //     setPage(res.page);
  //     setTotalPages(res.totalPages);
  //   } catch (err) {
  //     console.error(err);
  //     setProdutos([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
async function load(p = 1, query = "") {
  setLoading(true);
  console.log(query);
  try {
    const { items, page, totalPages } = await api.listProdutos({
      page: p,
      limit: 9,
      q: query
    });
    // console.log(items, page, totalPages);
    setProdutos(items);
    setPage(page);
    setTotalPages(totalPages);
  } catch (err) {
    console.error(err);
    setProdutos([]);
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
    load(1, "");
  }, []);

  return (
    <>
      <Hero />
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-6">
          <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Produtos
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              load(1, q);
            }}
            className="flex gap-3 w-full sm:w-auto"
            role="search"
            aria-label="Buscar produtos"
          >
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              className="flex-grow border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sea focus:ring-opacity-50 shadow-md transition"
            />
            <button
              type="submit"
              className="bg-sea text-white px-5 py-2 rounded-lg shadow-lg hover:bg-sea-hover focus:outline-none focus:ring-4 focus:ring-sea focus:ring-opacity-60 transition font-semibold"
            >
              Buscar
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 py-12 text-lg font-medium select-none">
            Carregando...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {produtos.map((p) => (
              <ProductCard key={p.id} produto={p} onAdd={addToCart} />
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-8 mt-12">
          <button
            onClick={() => load(page - 1, q)}
            disabled={page <= 1}
            className={`px-6 py-3 rounded-lg border-2 font-semibold transition ${
              page <= 1
                ? "border-sea text-sea cursor-not-allowed opacity-50"
                : "border-sea text-sea hover:bg-sea hover:text-white shadow-md"
            }`}
            aria-label="Página anterior"
          >
            Anterior
          </button>
          <span className="font-semibold text-gray-700 text-lg select-none">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => load(page + 1, q)}
            disabled={page >= totalPages}
            className={`px-6 py-3 rounded-lg border-2 font-semibold transition ${
              page >= totalPages
                ? "border-sea text-sea cursor-not-allowed opacity-50"
                : "border-sea text-white bg-sea hover:bg-sea-hover shadow-md"
            }`}
            aria-label="Próxima página"
          >
            Próxima
          </button>
        </div>
      </div>
    </>
  );
}
