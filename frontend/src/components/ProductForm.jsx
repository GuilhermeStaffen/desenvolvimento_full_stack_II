import React, { useState } from 'react';

export default function ProductForm({ produto = {}, onSave = () => {}, onCancel = () => {} }){
  const [nome, setNome] = useState(produto.nome || '');
  const [preco, setPreco] = useState(produto.preco || '');
  const [descricao, setDescricao] = useState(produto.descricao || '');
  const [imagem, setImagem] = useState(produto.imagem || '');

  async function handleSubmit(e){
    e.preventDefault();
    await onSave({ nome, preco: Number(preco), descricao, imagem });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <input className="w-full border p-2 rounded" value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome" />
      <input className="w-full border p-2 rounded" value={preco} onChange={e=>setPreco(e.target.value)} placeholder="Preço" type="number" step="0.01" />
      <input className="w-full border p-2 rounded" value={imagem} onChange={e=>setImagem(e.target.value)} placeholder="Imagem (url ou nome local)" />
      <textarea className="w-full border p-2 rounded" value={descricao} onChange={e=>setDescricao(e.target.value)} placeholder="Descrição" />
      <div className="flex gap-2">
        <button className="btn bg-sea text-white" type="submit">Salvar</button>
        <button type="button" onClick={onCancel} className="btn border">Cancelar</button>
      </div>
    </form>
  );
}
