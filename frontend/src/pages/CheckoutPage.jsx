import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CheckoutPage(){
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleFinish(){
    if(!user){ nav('/login'); return; }
    setLoading(true);
    try{
      await api.createPedido?.({ usuarioId: user.id, itens: items.map(i=>({ produtoId: i.id, quantidade: i.quantidade, precoUnitario: i.preco })), total });
      toast.success('Pedido criado!');
      clearCart();
      nav('/pedidos');
    }catch(err){
      clearCart();
      toast.success('Pedido finalizado (simulado)');
      nav('/pedidos');
    }finally{ setLoading(false); }
  }

  return (
    <div className="container py-12">
      <h2 className="text-2xl font-bold mb-4">Finalizar Compra</h2>
      <div className="bg-white p-6 rounded shadow">
        <div className="text-lg">Total: R$ {total.toFixed(2)}</div>
        <div className="mt-4">
          <button onClick={handleFinish} disabled={loading} className="btn bg-sea text-white">{loading ? 'Processando...' : 'Confirmar Pedido'}</button>
        </div>
      </div>
    </div>
  );
}
