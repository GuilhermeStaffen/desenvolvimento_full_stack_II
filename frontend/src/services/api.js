import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Adiciona token automaticamente em cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // =========================
  // Produtos
  // =========================
  listProdutos: async () => {
    const res = await api.get("/products");
    return res.data.items || [];
  },
  getProduto: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },
  createProduto: async (data) => {
    const res = await api.post("/products", data);
    return res.data;
  },
  updateProduto: async (id, data) => {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },
  deleteProduto: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  // =========================
  // Autenticação
  // =========================
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
  },
  register: async (data) => {
    const res = await api.post("/users", data);
    return res.data;
  },

  // =========================
  // Usuários
  // =========================
  listUsers: async () => {
    const res = await api.get("/users");
    return res.data;
  },

  // =========================
  // Carrinho
  // =========================
  getCart: async () => {
    const res = await api.get("/cart");
    return res.data;
  },
  addToCart: async (productId, quantity) => {
    const res = await api.post("/cart", { productId, quantity });
    return res.data;
  },
  removeFromCart: async (id) => {
    const res = await api.delete(`/cart/${id}`);
    return res.data;
  },
};