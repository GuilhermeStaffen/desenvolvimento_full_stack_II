// src/components/ProductForm.jsx
import React, { useEffect, useState } from "react";

export default function ProductForm({ current, onSave, onCancel }) {
  const [form, setForm] = useState({ name: "", price: 0, quantity: 0, image: "", description: "" });

  useEffect(() => {
    if (current) setForm({ name: current.name ?? "", price: current.price ?? 0, quantity: current.quantity ?? 0, image: current.image ?? "", description: current.description ?? "" });
    else setForm({ name: "", price: 0, quantity: 0, image: "", description: "" });
  }, [current]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    onSave({ ...current, ...form, price: Number(form.price), quantity: Number(form.quantity) });
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <label>
        <div className="text-sm font-medium">Nome</div>
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>

      <label>
        <div className="text-sm font-medium">Preço (R$)</div>
        <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
      </label>

      <label>
        <div className="text-sm font-medium">Quantidade</div>
        <input name="quantity" type="number" value={form.quantity} onChange={handleChange} required />
      </label>

      <label>
        <div className="text-sm font-medium">URL da imagem</div>
        <input name="image" value={form.image} onChange={handleChange} />
      </label>

      <label>
        <div className="text-sm font-medium">Descrição</div>
        <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-primary" type="submit">Salvar</button>
        <button type="button" onClick={onCancel} className="btn">Cancelar</button>
      </div>
    </form>
  );
}
