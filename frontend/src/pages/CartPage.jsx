import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function CartPage(){
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const nav = useNavigate();

  if(!items.length) return (
    <div className="container py-12 text-center">
      <h2 className="text-2xl font-bold">Carrinho vazio</h2>
      <Link to="/" className="text-sea mt-4 inline-block">Voltar aos produtos</Link>
    </div>
  );

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-4">Seu Carrinho</h2>
      <div className="space-y-4">
        {items.map(i => (
          <div key={i.id} className="flex gap-4 bg-white p-4 rounded shadow items-center">
            <img src={i.imagem?.startsWith('http') ? i.imagem : `/src/images/${i.imagem || 'placeholder.png'}`} alt={i.nome} className="w-28 h-28 object-contain" />
            <div className="flex-1">
              <div className="font-semibold">{i.nome}</div>
              <div className="text-sm text-gray-500">R$ {Number(i.preco).toFixed(2)}</div>
              <div className="mt-2">
                <input type="number" min="1" value={i.quantidade} onChange={(e)=>updateQuantity(i.id, Number(e.target.value))} className="w-20 border p-1 rounded" />
                <button onClick={()=>removeFromCart(i.id)} className="ml-4 text-sm text-red-500">Remover</button>
              </div>
            </div>
            <div className="font-bold">R$ {(i.preco * i.quantidade).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-xl font-bold">Total: R$ {total.toFixed(2)}</div>
        <button onClick={()=>nav('/checkout')} className="btn bg-sea text-white">Finalizar Pedido</button>
      </div>
    </div>
  );
}
