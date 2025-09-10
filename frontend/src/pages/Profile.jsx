import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Profile(){
  const { user } = useAuth();
  if(!user) return <div className="container py-12">Faça login</div>;

  return (
    <div className="container py-12">
      <div className="max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Perfil</h2>
        <div><strong>Nome:</strong> {user.nome}</div>
        <div><strong>Email:</strong> {user.email}</div>
        <div><strong>Tipo:</strong> {user.tipo}</div>
      </div>
    </div>
  );
}
