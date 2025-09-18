import React, { useState } from 'react';

export default function ProductForm({ produto = {}, onSave = () => {}, onCancel = () => {} }){
  const [name, setName] = useState(produto.name || '');
  const [price, setPrice] = useState(produto.price || '');
  const [descricao, setDescricao] = useState(produto.descricao || '');
  const [quantity, setQuantity] = useState(produto.quantity || '');
  const [imagem, setImagem] = useState(produto.images || '');

  async function handleSubmit(e){
    e.preventDefault();
    await onSave({ name, price: Number(price), descricao, imagem });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <input className="w-full border p-2 rounded" value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
      <input className="w-full border p-2 rounded" value={price} onChange={e=>setPrice(e.target.value)} placeholder="Preço" type="number" step="0.01" />
      <input className="w-full border p-2 rounded" value={imagem} onChange={e=>setImagem(e.target.value)} placeholder="Imagem (url ou name local)" />
      <textarea className="w-full border p-2 rounded" value={descricao} onChange={e=>setDescricao(e.target.value)} placeholder="Descrição" />
      <input className="w-full border p-2 rounded" value={quantity} onChange={e=>setQuantity(e.target.value)} placeholder="Quantidade" type="number" step="0.01" />
      <div>
        <button className="btn bg-sea text-white" type="submit">Salvar</button>
        <button type="button" onClick={onCancel} className="btn border">Cancelar</button>
      </div>
    </form>
  );
}
