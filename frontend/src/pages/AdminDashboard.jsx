import React, { useEffect, useState } from "react";
import {
  listProdutos,
  createProduto,
  updateProduto,
  deleteProduto,
  listPedidos,
  cancelPedido,
  shipPedido,
  deliverPedido,
} from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/PrivateRoute";
import toast from "react-hot-toast";

/* ------------------ FORM DE PRODUTO ------------------ */
function ProductForm({ current, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    price: 0,
    quantity: 0,
    description: "",
    images: [""], // ✅ começa com uma entrada
  });

  useEffect(() => {
    if (current) {
      setForm({
        name: current.name,
        price: current.price,
        quantity: current.quantity,
        description: current.description,
        images:
          current.images?.map((img) => img.url) || (current.image ? [current.image] : [""]),
      });
    } else {
      setForm({
        name: "",
        price: 0,
        quantity: 0,
        description: "",
        images: [""],
      });
    }
  }, [current]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(index, value) {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm((prev) => ({ ...prev, images: newImages }));
  }

  function addImageField() {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  }

  function removeImageField(index) {
    const newImages = form.images.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, images: newImages.length ? newImages : [""] }));
  }

  function submit(e) {
    e.preventDefault();
    onSave({
      ...current,
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
      images: form.images.filter((url) => url.trim() !== "").map((url) => ({ url })),
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <label className="text-sm text-gray-700">Nome</label>
      <input
        name="name"
        placeholder="Nome"
        value={form.name}
        onChange={handleChange}
        required
        className="border border-sea rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sea transition"
      />

      <label className="text-sm text-gray-700">Preço</label>
      <input
        name="price"
        type="number"
        placeholder="Preço"
        value={form.price}
        onChange={handleChange}
        required
        className="border border-sea rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sea transition"
      />

      <label className="text-sm text-gray-700">Quantidade</label>
      <input
        name="quantity"
        type="number"
        placeholder="Quantidade"
        value={form.quantity}
        onChange={handleChange}
        required
        className="border border-sea rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sea transition"
      />

      <label className="text-sm text-gray-700">Imagens (URLs)</label>
      <div className="space-y-3">
        {form.images.map((url, idx) => (
          <div key={idx} className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="URL da imagem"
              value={url}
              onChange={(e) => handleImageChange(idx, e.target.value)}
              className="flex-1 border border-sea rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sea transition"
            />
            <button
              type="button"
              onClick={() => removeImageField(idx)}
              className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addImageField}
          className="px-4 py-2 bg-sea text-white rounded-lg hover:bg-sea-400 transition"
        >
          + Adicionar Imagem
        </button>
      </div>

      <label className="text-sm text-gray-700">Descrição</label>
      <textarea
        name="description"
        placeholder="Descrição"
        value={form.description}
        onChange={handleChange}
        rows={4}
        className="border border-sea rounded-lg px-4 py-2 resize-y focus:outline-none focus:ring-2 focus:ring-sea transition"
      />

      <div className="flex gap-4 mt-3">
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

/* ------------------ DASHBOARD ------------------ */
export default function AdminDashboard() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [prodPage, setProdPage] = useState(1);
  const [prodTotalPages, setProdTotalPages] = useState(1);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);

  async function loadProdutos(p = 1) {
    try {
      const res = await listProdutos({ page: p, limit: 6 });
      const payload = res.data ?? res;
      setProdutos(payload.items ?? []);
      setProdPage(payload.page ?? p);
      setProdTotalPages(payload.totalPages ?? 1);
    } catch {
      toast.error("Erro ao carregar produtos");
    }
  }

  async function handleSave(prod) {
    try {
      const produtoPayload = {
        name: prod.name,
        description: prod.description,
        price: Number(prod.price),
        quantity: Number(prod.quantity),
        images: prod.images, // ✅ já vem no formato [{ url }]
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

  async function loadOrders(p = 1) {
    setLoadingOrders(true);
    try {
      const res = await listPedidos({ page: p, limit: 5 });
      const payload = res.data ?? res;
      const items = payload.items ?? payload.rows ?? payload.data ?? [];

      setOrders(items);
      setOrderTotalPages(
        payload.totalPages ??
          Math.ceil((payload.totalItems ?? items.length) / (payload.limit ?? 5))
      );
      setOrderPage(payload.page ?? p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  }

  async function handleCancel(id) {
    try {
      await cancelPedido(id);
      toast.success("Pedido cancelado com sucesso!");
      loadOrders();
    } catch {
      toast.error("Erro ao cancelar pedido");
    }
  }

  async function handleShip(id) {
    try {
      await shipPedido(id);
      toast.success("Pedido marcado como enviado!");
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao enviar pedido");
    }
  }

  async function handleDeliver(id) {
    try {
      await deliverPedido(id);
      toast.success("Pedido marcado como entregue!");
      loadOrders();
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao entregar pedido");
    }
  }

  useEffect(() => {
    if (user?.userType === "admin") {
      loadProdutos();
      loadOrders();
    }
  }, [user]);

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="container mx-auto py-12 px-6 space-y-16">
        <h1 className="text-4xl font-bold text-center md:text-left">
          Painel Administrativo
        </h1>

        {/* Produtos */}
        <div className="flex flex-col md:flex-row gap-12">
          <section className="md:flex-1 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">
              {selected ? "Editar produto" : "Novo produto"}
            </h2>
            <ProductForm
              current={selected}
              onSave={handleSave}
              onCancel={() => setSelected(null)}
            />
          </section>

          <section className="md:flex-2 bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Produtos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {produtos.map((p) => (
                <div
                  key={p.id}
                  className="border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col"
                >
                  <img
                    src={
                      p.images?.[0]?.url || p.image || "/src/images/placeholder.png"
                    }
                    alt={p.name}
                    className="h-36 w-full object-cover rounded-lg mb-4 shadow-inner"
                  />
                  <div className="flex-grow">
                    <h3 className="font-bold text-lg text-gray-900">{p.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      R$ {Number(p.price).toFixed(2)}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      Estoque: {p.quantity}
                    </p>
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

            {/* Paginação de produtos */}
            {prodTotalPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-8">
                <button
                  onClick={() => loadProdutos(prodPage - 1)}
                  disabled={prodPage <= 1}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span>
                  {prodPage} / {prodTotalPages}
                </span>
                <button
                  onClick={() => loadProdutos(prodPage + 1)}
                  disabled={prodPage >= prodTotalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            )}
          </section>
        </div>
        {/* Pedidos */}
        <section className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Pedidos Recentes</h2>
          {loadingOrders ? (
            <p className="text-center text-gray-500 py-12 text-lg select-none">Carregando...</p>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-400 py-12 italic select-none">Nenhum pedido encontrado</p>
          ) : (
            <>
              <div className="space-y-6">
                {orders.map((o) => (
                  <article
                    key={o.id}
                    className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
                    aria-label={`Pedido número ${o.id}`}
                  >
                    <header className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-sea">#{o.id}</h3>
                      <time
                        dateTime={new Date(o.createdAt).toISOString()}
                        className="text-sm text-gray-500 italic"
                      >
                        {new Date(o.createdAt).toLocaleString()}
                      </time>
                    </header>
                    <p className="mb-2 text-gray-700 font-medium">
                      Usuário:{" "}
                      <span className="text-gray-900 font-semibold">
                        {o.userId} - {o.userName}
                      </span>
                    </p>
                    <p className="mb-2 text-gray-700 font-medium">
                      Endereço:{" "}
                      <span className="text-gray-900 font-semibold">
                        {o.fullAddress}
                      </span>
                    </p>
                    <p className="mb-2 text-gray-700 font-medium">
                      Status:{" "}
                      <span className="text-gray-900 font-semibold">
                        {o.status}
                      </span>
                    </p>
                    <h4 className="mb-2 font-semibold text-gray-800">Itens:</h4>
                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                      {(o.products || []).map((it) => (
                        <div
                          key={`${o.id}-${it.productId}`}
                          className="flex items-center gap-4 border border-gray-200 rounded-xl p-3 bg-gray-50 shadow-sm"
                        >
                          <img
                            src={
                              it.images?.[0]?.url ||
                              it.image ||
                              "/src/images/placeholder.png"
                            }
                            alt={it.name}
                            className="w-16 h-16 object-cover rounded-lg shadow"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {it.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Quantidade: {it.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Preço unitário: R${" "}
                              {(it.unitPrice ?? it.price ?? 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-right font-extrabold text-sea text-lg">
                      Total: R$ {(o.total ?? 0).toFixed(2)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 justify-end">
                      {o.status !== "canceled" && (
                        <button
                          onClick={() => handleCancel(o.id)}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-semibold"
                        >
                          Cancelar
                        </button>
                      )}
                      {o.status === "placed" && (
                        <button
                          onClick={() => handleShip(o.id)}
                          className="px-4 py-2 rounded-lg bg-sea text-white hover:bg-sea transition text-sm font-semibold"
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
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  onClick={() => loadOrders(orderPage - 1)}
                  disabled={orderPage <= 1}
                  className={`px-6 py-3 rounded-lg border-2 font-semibold transition ${
                    orderPage <= 1
                      ? "border-sea text-sea cursor-not-allowed opacity-50"
                      : "border-sea text-sea hover:bg-sea hover:text-white shadow-md"
                  }`}
                  aria-label="Página anterior"
                >
                  Anterior
                </button>
                <span className="font-semibold text-gray-700 text-lg select-none">
                  {orderPage} / {orderTotalPages}
                </span>
                <button
                  onClick={() => loadOrders(orderPage + 1)}
                  disabled={orderPage >= orderTotalPages}
                  className={`px-6 py-3 rounded-lg border-2 font-semibold transition ${
                    orderPage >= orderTotalPages
                      ? "border-sea text-sea cursor-not-allowed opacity-50"
                      : "border-sea text-white bg-sea hover:bg-sea-hover shadow-md"
                  }`}
                  aria-label="Próxima página"
                >
                  Próxima
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
