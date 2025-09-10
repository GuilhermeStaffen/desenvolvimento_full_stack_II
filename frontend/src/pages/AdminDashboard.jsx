import React, { useEffect, useState } from 'react';
import api from '../services/api';
import ProductForm from '../components/ProductForm';

export default function AdminDashboard(){
  const [produtos, setProdutos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function loadProdutos(){
    try{ const res = await api.listProdutos(); setProdutos(res.data || []); }catch(err){ console.error(err); }
  }

  useEffect(()=>{ loadProdutos(); },[]);

  async function handleSave(prod){
    try{
      if(editing) await api.updateProduto(editing.id, prod);
      else await api.createProduto(prod);
      setEditing(null); setShowForm(false); loadProdutos();
    }catch(err){ console.error(err); }
  }

  async function handleDelete(id){
    if(!window.confirm('Excluir?')) return;
    try{ await api.deleteProduto(id); loadProdutos(); }catch(err){ console.error(err); }
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo</h1>
      {!showForm ? (
        <>
          <button onClick={()=>{ setEditing(null); setShowForm(true); }} className="btn bg-sea text-white mb-4">+ Novo Produto</button>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full">
              <thead className="bg-gray-100"><tr><th className="p-3 text-left">ID</th><th className="p-3 text-left">Nome</th><th className="p-3 text-left">Preço</th><th className="p-3 text-left">Ações</th></tr></thead>
              <tbody>
                {produtos.map(p=> (
                  <tr key={p.id} className="border-t">
                    <td className="p-3">{p.id}</td>
                    <td className="p-3">{p.nome}</td>
                    <td className="p-3">R$ {Number(p.preco).toFixed(2)}</td>
                    <td className="p-3 flex gap-2"><button onClick={()=>{ setEditing(p); setShowForm(true); }} className="px-3 py-1 bg-blue-600 text-white rounded">Editar</button><button onClick={()=>handleDelete(p.id)} className="px-3 py-1 bg-red-500 text-white rounded">Excluir</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <ProductForm produto={editing} onSave={handleSave} onCancel={()=>{ setEditing(null); setShowForm(false); }} />
      )}
    </div>
  );
}
