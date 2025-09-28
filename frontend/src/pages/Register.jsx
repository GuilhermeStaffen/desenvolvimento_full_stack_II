import React, { useState } from "react";
import * as api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    street: "",
    number: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);

  function handleAddressChange(e) {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm() {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !phone.trim() ||
      !address.street.trim() ||
      !address.number.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.zipcode.trim() ||
      !address.country.trim()
    ) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const body = {
        name,
        email,
        password,
        phone,
        address,
      };
      await api.createUser(body);
      toast.success("Conta criada com sucesso!");
      nav("/login");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-sea tracking-wide">
          Criar Conta
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">
              Nome completo <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Seu nome"
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sea transition shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sea transition shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">
              Senha <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Crie uma senha segura"
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sea transition shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-2 font-semibold text-gray-700">
              Telefone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+55 11 99999-8888"
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sea transition shadow-sm"
            />
          </div>
          <fieldset className="border border-gray-300 rounded-2xl p-4 space-y-4">
            <legend className="text-lg font-semibold text-gray-800 px-2">
              Endereço <span className="text-red-500">*</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                required
                placeholder="Rua"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sea transition"
              />
              <input
                name="number"
                value={address.number}
                onChange={handleAddressChange}
                required
                placeholder="Número"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sea transition"
              />
              <input
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                required
                placeholder="Cidade"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sea transition"
              />
              <input
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                required
                placeholder="Estado"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sea transition"
              />
              <input
                name="zipcode"
                value={address.zipcode}
                onChange={handleAddressChange}
                required
                placeholder="CEP"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sea transition"
              />
              <input
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                required
                placeholder="País"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sea transition"
              />
            </div>
          </fieldset>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-semibold shadow-lg transition ${
              loading
                ? "bg-sea cursor-not-allowed"
                : "bg-sea"
            }`}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}
