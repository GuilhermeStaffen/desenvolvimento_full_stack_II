import React from "react";

export default function CustomListGrid({
  title,
  items = [],
  onEdit,
  onDelete,
  page,
  totalPages,
  onPrevPage,
  onNextPage,
}) {
  return (
    <section className="bg-white p-8 rounded-xl shadow-lg">
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}

      {/* Lista de Itens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.itemTitle}
                className="h-36 w-full object-cover rounded-lg mb-4 shadow-inner"
              />
            )}
            <div className="flex-grow">
              <h3 className="font-bold text-lg text-gray-900">
                {item.itemTitle}
              </h3>
              {item.text1 && (
                <p className="text-gray-600 text-sm mt-1">{item.text1}</p>
              )}
              {item.text2 && (
                <p className="text-gray-600 text-sm mt-1">{item.text2}</p>
              )}
            </div>

            {(onEdit || onDelete) && (
              <div className="mt-6 flex gap-4">
                {onEdit && (
                  <button onClick={() => onEdit(item.id)} className="flex-1 bg-sea text-white py-2 rounded-lg hover:bg-sea-400 transition font-semibold shadow"
                  >
                    Editar
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold shadow"
                  >
                    Excluir
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            onClick={onPrevPage}
            disabled={page <= 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            onClick={onNextPage}
            disabled={page >= totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </section>
  );
}
