import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUser, updateUser } from "../services/api";
import toast from "react-hot-toast";

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      number: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
    },
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const u = await getUser(user.id);
        setUserData(u);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  useEffect(() => {
    if (!userData) return;
    setForm({
      name: userData.name ?? "",
      email: userData.email ?? "",
      phone: userData.phone ?? "",
      address: {
        street: userData.address.street ?? "",
        number: userData.address.number ?? "",
        city: userData.address.city ?? "",
        state: userData.address.state ?? "",
        zipcode: userData.address.zipcode ?? "",
        country: userData.address.country ?? "",
      },
    });
  }, [userData]);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name in form.address) {
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateUser(userData.id, {
        ...form,
        ...form.address,
      });
      setUserData(res);
      toast.success("Perfil atualizado com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600 text-xl font-medium select-none">
        Carregando...
      </div>
    );
  if (!userData)
    return (
      <div className="text-center py-20 text-gray-600 text-xl font-medium italic select-none">
        Usuário não encontrado.
      </div>
    );

  return (
    <div className="container mx-auto max-w-4xl px-8 py-12 bg-white rounded-2xl shadow-xl">
      <h2 className="text-4xl font-extrabold mb-10 text-gray-900 text-center tracking-wide">
        Meu Perfil
      </h2>
      <form onSubmit={handleSave} className="space-y-10">
        <section>
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-300 pb-2">
            Dados Pessoais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 tracking-wide">
                Nome Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Nome completo"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 tracking-wide">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Digite seu email"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700 tracking-wide">
                Telefone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Digite seu telefone"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-300 pb-2">
            Endereço
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-6">
            <div className="sm:col-span-2">
              <label htmlFor="street" className="block mb-2 text-sm font-medium text-gray-700 tracking-wide">
                Rua
              </label>
              <input
                id="street"
                name="street"
                value={form.address.street}
                onChange={handleChange}
                placeholder="Sua rua"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="number" className="block mb-2 text-sm font-medium text-gray-700 tracking-wide">
                Número
              </label>
              <input
                id="number"
                name="number"
                value={form.address.number}
                onChange={handleChange}
                placeholder="Número"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            <div>
              <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-700 tracking-wide">
                Cidade
              </label>
              <input
                id="city"
                name="city"
                value={form.address.city}
                onChange={handleChange}
                placeholder="Cidade"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="state" className="block mb-2 text-sm font-medium text-gray-700 tracking-wide">
                Estado
              </label>
              <input
                id="state"
                name="state"
                value={form.address.state}
                onChange={handleChange}
                placeholder="Estado"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="zipcode" className="block mb-2 text-sm font-medium text-gray-700 tracking-wide">
                CEP
              </label>
              <input
                id="zipcode"
                name="zipcode"
                value={form.address.zipcode}
                onChange={handleChange}
                placeholder="CEP"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="country" className="block mb-2 text-sm font-medium text-gray-700 tracking-wide">
                País
              </label>
              <input
                id="country"
                name="country"
                value={form.address.country}
                onChange={handleChange}
                placeholder="País"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className={`w-full py-4 rounded-xl text-white font-semibold ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-sea hover:from-sea hover:to-sea"} shadow-lg transition`}
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}
