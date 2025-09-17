import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem("user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  async function login({ email, senha }) {
    try {
      const res = await api.login({ email, password: senha });
      const payload = res.data ?? {};
      const token = payload.token ?? null;
      const userObj = payload.user ?? payload;

      if (!token) throw new Error("Token ausente no retorno do login");

      localStorage.setItem("token", token);

      const normalizedUser = {
        id: userObj.id,
        name: userObj.name ?? "",
        email: userObj.email ?? "",
        userType: userObj.userType ?? "customer",
        street: userObj.street ?? "",
        number: userObj.number ?? "",
        city: userObj.city ?? "",
        state: userObj.state ?? "",
        zipcode: userObj.zipcode ?? "",
        country: userObj.country ?? ""
      };

      setUser(normalizedUser);
      toast.success("Login realizado com sucesso!");
      return normalizedUser;
    } catch (err) {
      console.error(err);
      toast.error("Falha no login. Verifique suas credenciais.");
      throw err;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  async function refreshUser() {
    try {
      const res = await api.me();
      const u = res.data ?? res;
      if (u) {
        const normalizedUser = {
          id: u.id,
          name: u.name ?? "",
          email: u.email ?? "",
          userType: u.userType ?? "customer",
          street: u.street ?? "",
          number: u.number ?? "",
          city: u.city ?? "",
          state: u.state ?? "",
          zipcode: u.zipcode ?? "",
          country: u.country ?? ""
        };
        setUser(normalizedUser);
      }
    } catch (err) {
      console.error("Erro ao buscar usuário logado", err);
      logout();
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
