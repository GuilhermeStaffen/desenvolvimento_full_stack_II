import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function OrdersPage(){
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);

  useEffect(()=>{
    async function load(){
      try{
        const res = await api.listPedidos?.(user?.tipo === 'admin' ? {} : { usuarioId: user?.id });
        setPedidos(res?.data || []);
      }catch(err){ console.error(err); }
    }
    load();
  },[user]);

  return (
    <div className="container py-12">
      <h2 className="text-2xl font-bold mb-4">Meus Pedidos</h2>
      {pedidos.length===0 ? <div>Nenhum pedido</div> : (
        <div className="space-y-4">
          {pedidos.map(p => (
            <div key={p.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <div>Pedido #{p.id}</div>
                <div className="font-bold">R$ {Number(p.total).toFixed(2)}</div>
              </div>
              <div className="mt-2">
                {(p.itens || []).map((it, idx)=> (
                  <div key={idx} className="flex justify-between text-sm">
                    <div>{it.nome || `Produto ${it.produtoId}`}</div>
                    <div>{it.quantidade} x R$ {Number(it.precoUnitario || it.preco).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
