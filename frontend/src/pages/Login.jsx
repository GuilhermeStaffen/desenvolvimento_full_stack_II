import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, senha });
      nav("/");
    } catch (err) {
      setError("Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-sea tracking-wide">
          Entrar
        </h2>

        {error && (
          <div className="mb-6 text-center text-red-600 font-semibold">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
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
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-700">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="text-sea font-semibold hover:underline">
            Cadastre-se aqui
          </Link>
        </div>
      </div>
    </div>
  );
}
