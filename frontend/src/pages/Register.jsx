import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register(){
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { register } = useAuth();
  const nav = useNavigate();

  async function handleSubmit(e){
    e.preventDefault();
    try{
      await register({ nome, email, senha });
      nav('/login');
    }catch(err){}
  }

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Criar conta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border p-2 rounded" placeholder="Nome" value={nome} onChange={e=>setNome(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full border p-2 rounded" placeholder="Senha" value={senha} type="password" onChange={e=>setSenha(e.target.value)} />
          <button className="w-full btn bg-sea text-white" type="submit">Criar conta</button>
        </form>
      </div>
    </div>
  );
}
