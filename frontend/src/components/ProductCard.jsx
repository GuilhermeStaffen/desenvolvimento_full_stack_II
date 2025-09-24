import React, {useState} from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ produto, onAdd }) {
  if (!produto) return null;
  const price = Number(produto.price ?? produto.preco ?? 0).toFixed(2);

  const images = produto.images?.length > 0 ? produto.images.map((img) => img.url) : ["/src/images/placeholder.png"];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      <div className="relative w-full h-48">
        <img
          src={images[currentIndex]}
          alt={produto.name}
          className="w-full h-48 object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white px-2 py-1 rounded-full hover:bg-opacity-60"
            >
              ‹
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white px-2 py-1 rounded-full hover:bg-opacity-60"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === currentIndex ? "bg-sea" : "bg-gray-300"
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-1">{produto.name}</h3>
        <p className="text-gray-600 text-sm flex-grow">{produto.description?.slice(0, 100)}</p>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">Estoque {produto.quantity}</p>
        <div className="flex justify-between items-center mt-4">
          <div className="font-bold text-lg">R$ {price}</div>
          <div className="flex gap-2">
            <button
              onClick={() => onAdd(produto)}
              className="bg-sea text-white px-3 py-1 rounded hover:bg-sea transition"
            >
              Adicionar
            </button>
            <Link
              to={`/produtos/${produto.id}`}
              className="border border-sea text-gray-700 px-3 py-1 rounded hover:bg-sea transition"
            >
              Ver
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
