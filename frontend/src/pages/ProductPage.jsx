import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as api from "../services/api";
import { useCart } from "../contexts/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const images =
    produto.images?.length > 0
      ? produto.images.map((img) => img.url)
      : ["/src/images/placeholder.png"];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="container mx-auto px-6 py-12 bg-white rounded-3xl shadow-xl max-w-6xl">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="relative w-full md:w-96 h-96 flex-shrink-0">
          <img
            src={images[currentIndex]}
            alt={produto.name}
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white px-3 py-1 rounded-full hover:bg-opacity-60"
              >
                ‹
              </button>

              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white px-3 py-1 rounded-full hover:bg-opacity-60"
              >
                ›
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i === currentIndex ? "bg-sea" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-4xl font-extrabold mb-6 text-gray-900 tracking-wide break-words">
              {produto.name}
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed text-lg break-words">
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
