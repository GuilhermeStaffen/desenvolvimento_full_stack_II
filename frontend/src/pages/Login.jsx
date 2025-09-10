import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/'); // redireciona
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Entrar</h2>
        {erro && <div className="text-red-600 mb-2">{erro}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border p-2 rounded" type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
          <button className="w-full btn bg-sea text-white" type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
        </form>
      </div>
    </div>
  );
}
