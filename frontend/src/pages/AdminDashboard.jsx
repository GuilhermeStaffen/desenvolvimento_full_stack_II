import React, { useEffect, useState } from "react";
import {
  listProdutos, createProduto, updateProduto, deleteProduto, listPedidos, cancelPedido, shipPedido, deliverPedido
} from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/PrivateRoute";
import toast from "react-hot-toast";

function ProductForm({ current, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    price: 0,
    quantity: 0,
    description: "",
    image: "",
  });

  useEffect(() => {
    if (current)
      setForm({
        name: current.name,
        price: current.price,
        quantity: current.quantity,
        description: current.description,
        image: current.image,
      });
    else
      setForm({
        name: "",
        price: 0,
        quantity: 0,
        description: "",
        image: "",
      });
  }, [current]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    onSave({
      ...current,
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
  }



  return (
    <form onSubmit={submit} className="grid gap-5">
      <input
        name="name"
        placeholder="Nome"
        value={form.name}
        onChange={handleChange}
        required
        className="border border-sea rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <input
        name="price"
        type="number"
        placeholder="Preço"
        value={form.price}
        onChange={handleChange}
        required
        className="border border-sea rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <input
        name="quantity"
        type="number"
        placeholder="Quantidade"
        value={form.quantity}
        onChange={handleChange}
        required
        className="border border-sea rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <input
        name="image"
        placeholder="URL imagem"
        value={form.image}
        onChange={handleChange}
        className="border border-sea rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <textarea
        name="description"
        placeholder="Descrição"
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="border border-sea rounded-lg px-4 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-sea text-white px-6 py-2 rounded-lg hover:bg-sea-400 transition font-semibold shadow"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [selected, setSelected] = useState(null);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadProdutos() {
    const res = await listProdutos({ page: 1, limit: 200 });
    setProdutos(res.items || []);
  }

  async function loadOrders(p = 1) {
    setLoadingOrders(true);
    try {
      const res = await listPedidos({ page: p, limit: 5 }); // limite fixo de 5 por exemplo
      const payload = res.data ?? res;
      const items = payload.items ?? payload.rows ?? payload.data ?? [];
      setOrders(items);

      // pega infos de paginação do backend
      const total = payload.total ?? items.length;
      const limit = payload.limit ?? 5;
      setTotalPages(Math.ceil(total / limit));
      setPage(payload.page ?? p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  }

  useEffect(() => {
    if (user?.userType === "admin") {
      loadProdutos();
      loadOrders();
    }
  }, [user]);

  async function handleSave(prod) {
    try {
      const produtoPayload = {
        name: prod.name,
        description: prod.description,
        price: Number(prod.price),
        quantity: Number(prod.quantity),
        image: prod.image,
      };
      if (prod.id) {
        await updateProduto(prod.id, produtoPayload);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createProduto(produtoPayload);
        toast.success("Produto criado com sucesso!");
      }
      setSelected(null);
      loadProdutos();
    } catch {
      toast.error("Erro ao salvar produto");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Excluir?")) return;
    try {
      await deleteProduto(id);
      loadProdutos();
    } catch {
      toast.error("Erro ao excluir produto");
    }
  }

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="container mx-auto py-12 px-6 space-y-16">
        <h1 className="text-4xl font-bold text-center md:text-left">Painel Administrativo</h1>

        <div className="flex flex-col md:flex-row gap-12">
          <section className="md:flex-1 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">{selected ? "Editar produto" : "Novo produto"}</h2>
            <ProductForm current={selected} onSave={handleSave} onCancel={() => setSelected(null)} />
          </section>

          <section className="md:flex-2 bg-white p-8 rounded-xl shadow-lg overflow-x-auto max-h-[720px]">
            <h2 className="text-2xl font-semibold mb-6">Produtos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {produtos.map((p) => (
                <div key={p.id} className="border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col">
                  <img
                    src={p.image || "/src/assets/placeholder.png"}
                    alt={p.name}
                    className="h-36 w-full object-cover rounded-lg mb-4 shadow-inner"
                  />
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-900">{p.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">R$ {Number(p.price).toFixed(2)}</p>
                    <p className="text-gray-600 text-sm mt-1">Estoque: {p.quantity}</p>
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => setSelected(p)}
                      className="flex-1 bg-sea text-white py-2 rounded-lg hover:bg-sea-400 transition font-semibold shadow"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold shadow"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-white p-8 rounded-xl shadow-lg max-h-[480px] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">Pedidos Recentes</h2>
          {loadingOrders ? (
            <p className="text-center text-gray-500 py-12 text-lg select-none">Carregando...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-400 py-12 italic select-none">Nenhum pedido encontrado</p>
          ) : (
            <div className="space-y-6">
              {orders.map((o) => (
                <article
                  key={o.id}
                  className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
                  aria-label={`Pedido número ${o.id}`}
                >
                  <header className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-sea">#{o.id}</h3>
                    <time dateTime={new Date(o.createdAt).toISOString()} className="text-sm text-gray-500 italic">
                      {new Date(o.createdAt).toLocaleString()}
                    </time>
                  </header>
                  <p className="mb-2 text-gray-700 font-medium">
                    Usuário: <span className="text-gray-900 font-semibold">{o.userId} - {o.userName}</span>
                  </p>
                  <p className="mb-2 text-gray-700 font-medium">
                    Endereço: <span className="text-gray-900 font-semibold">{o.fullAddress}</span>
                  </p>
                  <p className="mb-2 text-gray-700 font-medium">
                    Status: <span className="text-gray-900 font-semibold">{o.status}</span>
                  </p>
                  <h4 className="mb-2 font-semibold text-gray-800">Itens:</h4>
                  <ul className="list-disc list-sea space-y-1 mb-4 text-gray-700 max-h-60 overflow-y-auto">
                    {(o.products || []).map((it) => (
                      <li key={`${o.id}-${it.productId}`}>
                        {it.name} x{it.quantity} - R$ {(it.unitPrice ?? it.price ?? 0).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <p className="text-right font-extrabold text-sea text-lg">
                    Total: R$ {(o.total ?? 0).toFixed(2)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 justify-end">
                    <button
                      onClick={() => handleCancel(o.id)}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-semibold"
                    >
                      Cancelar
                    </button>
                    {o.status === "placed" && (
                      <button
                        onClick={() => handleShip(o.id)}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        Enviar
                      </button>
                    )}
                    {o.status === "shipped" && (
                      <button
                        onClick={() => handleDeliver(o.id)}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition text-sm font-semibold"
                      >
                        Entregar
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
