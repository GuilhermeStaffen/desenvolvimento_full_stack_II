import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ produto, onAdd }) {
  const imageSrc = produto.imagem
    ? (typeof produto.imagem === "string" && produto.imagem.startsWith("http")
        ? produto.imagem
        : `/src/images/${produto.imagem}`)
    : "/src/images/placeholder.png";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
      <div className="h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img src={imageSrc} alt={produto.nome} className="object-contain h-full w-full" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800">{produto.nome}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{produto.descricao}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xl font-bold text-deepsea">R$ {Number(produto.preco).toFixed(2)}</div>
          <div className="flex gap-2">
            <button onClick={() => onAdd(produto)} className="px-3 py-1 bg-sea text-white rounded">Adicionar</button>
            <Link to={`/produto/${produto.id}`} className="px-3 py-1 border rounded text-sm">Ver</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
