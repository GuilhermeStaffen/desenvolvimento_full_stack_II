import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const client = axios.create({ baseURL: `${baseURL}/api` });

// Attach token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

function normalizeProduct(p) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name ?? "",
    description: p.description ?? "",
    price: Number(p.price ?? 0),
    quantity: Number(p.quantity ?? 0),
    images: p.images ?? null,
    raw: p
  };
}

function normalizeSupplier(s) {
  if (!s) return null;
  return {
    id: s.id,
    name: s.name ?? "",
    email: s.email ?? "",
    phone: s.phone ?? "",
    website: s.website ?? "",
    cnpj: s.cnpj ?? "",
    raw: s
  };
}

/* AUTH */
export const login = (data) => client.post("/auth/login", data);

/* USERS */
export function listUsers(params = {}) {
  return client.get("/users", { params });
}
export const getUser = (id) =>
  client.get(`/users/${id}`).then((r) => r.data);

export const updateUser = (id, data) =>
  client.put(`/users/${id}`, data).then((r) => r.data);

export function createUser(body) {
  return client.post("/users", body);
}

// PRODUCTS
export async function listProdutos(params = {}) {
  const res = await client.get("/products", { params });
  const payload = res.data ?? {};
  const rawItems = payload.items ?? payload.rows ?? payload.data ?? [];
  const items = rawItems.map(normalizeProduct);
  const page = Number(payload.page ?? 1);
  const totalPages = Number(payload.totalPages ?? Math.max(1, Math.ceil((payload.total ?? rawItems.length) / (params.limit ?? payload.limit ?? rawItems.length))));
  const totalItems = Number(payload.total ?? payload.totalItems ?? payload.count ?? rawItems.length);
  return { items, page, totalPages, totalItems, raw: payload };
}

export async function getProduto(id) {
  const res = await client.get(`/products/${id}`);
  return normalizeProduct(res.data);
}

export function createProduto(body) { return client.post("/products", body); }
export function updateProduto(id, body) { return client.put(`/products/${id}`, body); }
export function deleteProduto(id) { return client.delete(`/products/${id}`); }

export async function listSuppliers(params = {}) {
  const res = await client.get("/suppliers", { params });
  const payload = res.data ?? {};
  const rawItems = payload.items ?? payload.rows ?? payload.data ?? [];
  const items = rawItems.map(normalizeSupplier);
  const page = Number(payload.page ?? 1);
  const totalPages = Number(payload.totalPages ?? Math.max(1, Math.ceil((payload.total ?? rawItems.length) / (params.limit ?? payload.limit ?? rawItems.length))));
  const totalItems = Number(payload.total ?? payload.totalItems ?? payload.count ?? rawItems.length);
  return { items, page, totalPages, totalItems, raw: payload };
}

export async function getSupplier(id) {
  const res = await client.get(`/suppliers/${id}`);
  return normalizeSupplier(res.data);
}
export function createSupplier(body) { return client.post("/suppliers", body); }
export function updateSupplier(id, body) { return client.put(`/suppliers/${id}`, body); }
export function deleteSupplier(id) { return client.delete(`/suppliers/${id}`); }

// CART
export function getCart() { return client.get("/cart"); }
export function postCart(productId, quantity = 1) { return client.post("/cart", { productId, quantity }); }
export function putCart(productId, quantity) { return client.put(`/cart/${productId}`, { quantity }); }
export function deleteCartItem(productId) { return client.delete(`/cart/${productId}`); }

// ORDERS
export function createPedido(body) { return client.post("/orders", body); }
export function listPedidos(params = {}) { return client.get("/orders", { params }); }
export function listMyOrders(params = {}) { return client.get("/orders/my-orders", { params }); }
export function cancelPedido(id) { return client.post(`/orders/${id}/canceled`); }
export function shipPedido(id) { return client.post(`/orders/${id}/shipped`); }
export function deliverPedido(id) { return client.post(`/orders/${id}/delivered`); }


//DASHBOARD
export async function getAdminDashboard() {
  const response = await client.get('/admin/dashboard');
  return response.data;
}

export default {
  // auth
  login,
  // users
  listUsers, getUser, updateUser, createUser,
  // products
  listProdutos, getProduto, createProduto, updateProduto, deleteProduto,
  // suppliers
  getSupplier, createSupplier, updateSupplier, deleteSupplier, listSuppliers,
  // cart
  getCart, postCart, putCart, deleteCartItem,
  // orders
  createPedido, listPedidos, listMyOrders, cancelPedido, shipPedido, deliverPedido,
  // dashboard
  getAdminDashboard,
};
