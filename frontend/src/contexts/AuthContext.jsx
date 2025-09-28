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
      let res;
      try {
        res = await api.login({ email, password: senha });
      } catch {
        res = await api.login({ email, senha });
      }

      const payload = res.data ?? res;
      const token =
        payload.token ??
        payload.accessToken ??
        payload.access_token ??
        payload.tokenJwt ??
        null;

      const userObj = payload.user ?? payload.usuario ?? payload;

      if (token) localStorage.setItem("token", token);

      const normalizedUser = userObj
        ? {
            id: userObj.id,
            name: userObj.name ?? "",
            email: userObj.email ?? "",
            userType: userObj.userType ?? userObj.role ?? "customer",
            street: userObj.street ?? "",
            number: userObj.number ?? "",
            city: userObj.city ?? "",
            state: userObj.state ?? "",
            zipcode: userObj.zipcode ?? "",
            country: userObj.country ?? "",
          }
        : null;

      setUser(normalizedUser);
      toast.success("Login realizado");
      return normalizedUser;
    } catch (err) {
      toast.error("Falha no login");
      throw err;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  async function refreshUser() {
    if (!user?.id) return;
    try {
      const u = await api.getUser(user.id);
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
          country: u.country ?? "",
        };
        setUser(normalizedUser);
      }
    } catch {
      // ignora erro
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
