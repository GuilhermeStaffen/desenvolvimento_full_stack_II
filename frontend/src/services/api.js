import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const client = axios.create({ baseURL: `${baseURL}/api` });

// Attach token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

function normalizeProduct(p) {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name ?? "",
    description: p.description ?? "",
    price: Number(p.price ?? 0),
    quantity: p.quantity ?? 0,
    image: p.image ?? null,
    raw: p
  };
}

// AUTH
export function login(body) { // body: { email, password }
  return client.post("/auth/login", body);
}
export function me() { return client.get("/auth/me"); }
export function register(body) { return client.post("/users", body); }

// USERS
export function listUsers() { return client.get("/users"); }
export function updateUser(id, body) { return client.put(`/users/${id}`, body); }

// PRODUCTS
export async function listProdutos(params) {
  const parametros = params['q'];
  const res = await client.get("/products?name="+parametros);
  const payload = res.data ?? {};
  const rawItems = Array.isArray(payload) ? payload : (payload.items ?? payload.rows ?? payload.data ?? []);
  const items = rawItems.map(normalizeProduct);
  return {
    items: payload.items ?? payload.rows ?? [],
    page: payload.page ?? payload.currentPage ?? 1,
    limit: payload.limit ?? payload.pageSize ?? items.length,
    total: payload.total ?? payload.count ?? items.length,
    totalItems: payload.total ?? payload.count ?? items.length,
    totalPages: payload.totalPages ?? Math.max(1, Math.ceil((payload.totalItems ?? items.length) / (payload.limit ?? items.length)))
  };
}

export async function getProduto(id) {
  const res = await client.get(`/products/${id}`);
  return normalizeProduct(res.data);
}
export function createProduto(body) { 
  return client.post('/products', body, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
}
export function updateProduto(id, body) { return client.put(`/products/${id}`, body); }
export function deleteProduto(id) { return client.delete(`/products/${id}`); }

// CART
export function getCart() { return client.get("/cart"); }
export function postCart(productId, quantity=1) { return client.post("/cart", { productId, quantity }); }
export function deleteCartItem(productId) { return client.delete(`/cart/${productId}`); }

// ORDERS
export function createPedido(body) { return client.post("/orders", body); }
export function listPedidos(params = {}) { return client.get("/orders", { params }); }
export function listMyOrders(params = {}) { return client.get("/orders/my-orders", { params }); }

// default export to keep compatibility with older imports
export default {
  login, me, register,
  listUsers, updateUser,
  listProdutos, getProduto, createProduto, updateProduto, deleteProduto,
  getCart, postCart, deleteCartItem,
  createPedido, listPedidos, listMyOrders,
  rawClient: client
};
