import React, { useState } from "react";
import * as api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const nav = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    // setLoading(true);
    try {
      await api.register({ name: nome, email, password: senha });
      toast.success("Conta criada");
      nav("/login");
    } catch (err) {
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
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="nome" className="block mb-2 font-semibold text-gray-700">
              Nome completo
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Seu nome"
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sea transition shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
              Email
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
            <label htmlFor="senha" className="block mb-2 font-semibold text-gray-700">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Crie uma senha segura"
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-sea transition shadow-sm"
            />
          </div>
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
