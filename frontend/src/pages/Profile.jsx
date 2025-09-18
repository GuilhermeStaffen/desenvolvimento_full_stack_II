import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { updateUser } from "../services/api";

export default function Profile() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user['name'] ?? "");
  const [email, setEmail] = useState(user['email'] ?? "");
  const [address, setAddress] = useState({
    street: user['street'] ?? "",
    number: user['number'] ?? "",
    city: user['city'] ?? "",
    state: user['state'] ?? "",
    zipcode: user['zipcode'] ?? "",
    country: user['country'] ?? "",
  });

  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setName(user['name'] ?? "");
    setEmail(user['email'] ?? "");
    setAddress({
    street: user['street'] ?? "",
    number: user['number'] ?? "",
    city: user['city'] ?? "",
    state: user['state'] ?? "",
    zipcode: user['zipcode'] ?? "",
    country: user['country'] ?? "",
    });
  }, [user]);

  function handleAddressChange(e) {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const body = {
        name,
        email,
        address,
      };

      const res = await updateUser(user.id, body);
      const u = res.data ?? res;

      const normalized = {
        id: u.id ?? user.id,
        name: u.name ?? user.name,
        email: u.email ?? email,
        address: u.address ?? address,
        userType: u.userType ?? user.userType,
      };

      setUser(normalized);
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-8 py-12 bg-white rounded-2xl shadow-xl">
      <h2 className="text-4xl font-extrabold mb-10 text-gray-900 text-center tracking-wide">
        Meu Perfil
      </h2>
      <form onSubmit={handleSave} className="space-y-10">
        {/* Dados Pessoais */}
        <section>
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-300 pb-2">
            Dados Pessoais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-700 tracking-wide"
              >
                Name Completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Name completo"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700 tracking-wide"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Digite seu email"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Endereço */}
        <section>
          <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-300 pb-2">
            Endereço
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="street"
                className="block mb-2 text-sm font-medium text-gray-700 tracking-wide"
              >
                Rua
              </label>
              <input
                id="street"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                placeholder="Sua rua"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="number"
                className="block mb-2 text-sm font-medium text-gray-700 tracking-wide"
              >
                Número
              </label>
              <input
                id="number"
                name="number"
                value={address.number}
                onChange={handleAddressChange}
                placeholder="Número"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            <div>
              <label
                htmlFor="city"
                className="block mb-2 text-sm font-medium text-gray-700 tracking-wide"
              >
                Cidade
              </label>
              <input
                id="city"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                placeholder="Cidade"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="block mb-2 text-sm font-medium text-gray-700 tracking-wide"
              >
                Estado
              </label>
              <input
                id="state"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                placeholder="Estado"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="zipcode"
                className="block mb-2 text-sm font-medium text-gray-700 tracking-wide"
              >
                CEP
              </label>
              <input
                id="zipcode"
                name="zipcode"
                value={address.zipcode}
                onChange={handleAddressChange}
                placeholder="CEP"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="block mb-2 text-sm font-medium text-gray-700 tracking-wide"
              >
                País
              </label>
              <input
                id="country"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                placeholder="País"
                className="w-full rounded-xl border border-gray-300 px-5 py-3 bg-gray-50 text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-4 focus:ring-blue-400 transition shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Botão Salvar */}
        <button
          type="submit"
          disabled={saving}
          className={`w-full py-4 rounded-xl text-white font-semibold ${
            saving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-sea hover:from-sea hover:to-sea"
          } shadow-lg transition`}
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>
    </div>
  );
}
