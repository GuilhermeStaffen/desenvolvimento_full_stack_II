import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }){
  const [items, setItems] = useState(()=>{
    const s = localStorage.getItem('cart');
    return s ? JSON.parse(s) : [];
  });

  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(items));
  },[items]);

  function addToCart(produto, quantidade=1){
    setItems(prev=>{
      const found = prev.find(i=>i.id===produto.id);
      if(found) return prev.map(i=> i.id===produto.id ? {...i, quantidade: i.quantidade + quantidade} : i);
      toast.success('Adicionado ao carrinho');
      return [...prev, {...produto, quantidade}];
    });
  }

  function removeFromCart(id){
    setItems(prev => prev.filter(i=>i.id!==id));
    toast('Removido');
  }

  function updateQuantity(id, quantidade){
    setItems(prev => prev.map(i=> i.id===id ? {...i, quantidade} : i));
  }

  function clearCart(){ setItems([]); }

  const total = items.reduce((acc, it)=> acc + (it.preco * it.quantidade), 0);

  return <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>{children}</CartContext.Provider>
}

export function useCart(){ return useContext(CartContext); }
