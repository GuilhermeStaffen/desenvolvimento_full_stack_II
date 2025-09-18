import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ produto, onAdd }) {
  if (!produto) return null;
  const price = Number(produto.price ?? produto.preco ?? 0).toFixed(2);

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      <img
        src={produto.image || "/src/assets/placeholder.png"}
        alt={produto.name}
        className="w-full h-48 object-cover"
      />
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
