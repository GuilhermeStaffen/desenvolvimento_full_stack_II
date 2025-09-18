import React, { createContext, useContext, useEffect, useState } from "react";
import * as api from "../services/api";
import toast from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { const s = localStorage.getItem("cart"); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  async function syncFromBackend() {
    setLoading(true);
    try {
      const res = await api.getCart();
      const data = res.data ?? res;
      const arr = Array.isArray(data) ? data : (data.items ?? data.rows ?? []);
      const mapped = arr.map(it => ({
        id: it.productId ?? it.product?.id ?? it.id,
        name: it.name ?? it.product?.name ?? it.product?.title ?? "",
        price: Number(it.unitPrice ?? it.price ?? it.product?.price ?? 0),
        quantity: it.quantity ?? it.qty ?? 1,
        image: it.product?.image ?? it.image ?? null
      }));
      setItems(mapped);
    } catch (err) {
      // keep local cart if backend fails
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // try to sync once on load
    syncFromBackend();
    // eslint-disable-next-line
  }, []);

  async function addToCart(prod, qtd = 1) {
    // add to backend if available
    try {
      await api.postCart(prod.id ?? prod.productId ?? prod.raw?.id, qtd);
      toast.success("Adicionado ao carrinho (server)");
      await syncFromBackend();
    } catch (err) {
      // fallback to local add
      setItems(prev => {
        const found = prev.find(i => i.id === prod.id);
        if (found) return prev.map(i => i.id === prod.id ? { ...i, quantity: i.quantity + qtd } : i);
        return [...prev, { id: prod.id, name: prod.name, price: prod.price, quantity: qtd, image: prod.image }];
      });
      toast.success("Adicionado ao carrinho (local)");
    }
  }

  async function removeFromCart(id) {
    try {
      await api.deleteCartItem(id);
      toast.success("Removido do carrinho (server)");
      await syncFromBackend();
    } catch (err) {
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success("Removido do carrinho (local)");
    }
  }

  function updateQuantity(id, qtd) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qtd } : i));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((acc, it) => acc + ((it.price || 0) * (it.quantity || 0)), 0);

  return <CartContext.Provider value={{ items, loading, addToCart, removeFromCart, updateQuantity, clearCart, syncFromBackend, total }}>{children}</CartContext.Provider>;
}

export function useCart() { return useContext(CartContext); }
