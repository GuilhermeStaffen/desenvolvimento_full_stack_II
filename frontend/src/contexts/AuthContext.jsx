// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem("user");
    return s ? JSON.parse(s) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  async function register({ nome, email, senha }) {
    try {
      const body = { name: nome, email, password: senha };
      const res = await api.register(body);
      toast.success("Conta criada com sucesso!");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao cadastrar");
      throw err;
    }
  }

  async function login({ email, senha }) {
    try {
      const res = await api.login({ email, password: senha });
      const payload = res.data || {};

      const token = payload.token ?? payload.accessToken ?? payload.access_token ?? null;
      const userObj = payload.user ?? payload.usuario ?? payload.usuario ?? payload.userData ?? payload;

      if (!token) {
        console.warn("Login response without token, saving nothing");
      } else {
        localStorage.setItem("token", token);
      }

      let normalizedUser = null;
      if (userObj && typeof userObj === "object") {
        normalizedUser = {
          id: userObj.id,
          nome: userObj.name ?? userObj.nome ?? userObj.username ?? "",
          email: userObj.email ?? "",
          tipo: userObj.userType ?? userObj.tipo ?? userObj.role ?? "customer",
        };
      }

      if (normalizedUser) setUser(normalizedUser);
      toast.success("Login realizado");
      return normalizedUser;
    } catch (err) {
      toast.error("Credenciais inválidas");
      throw err;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
