import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import logo from "../images/logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const nav = useNavigate();

  return (
    <header className="bg-white shadow sticky top-0 z-30">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo Loja de Pesca" className="h-10 w-auto" />
          <div className="text-xl font-bold text-deepsea">PescaPro</div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-deepsea">Produtos</Link>
          <Link to="/pedidos" className="text-gray-700 hover:text-deepsea">Pedidos</Link>
          <Link to="/carrinho" className="text-gray-700 hover:text-deepsea">Carrinho ({items.length})</Link>
          {user ? (
            <>
              <Link to="/perfil" className="text-gray-700 hover:text-deepsea">Olá, {user.nome}</Link>
              {user.tipo === "admin" && <Link to="/admin" className="text-gray-700 hover:text-deepsea">Admin</Link>}
              <button onClick={() => { logout(); nav("/"); }} className="ml-2 px-3 py-1 bg-highlight text-white rounded">Sair</button>
            </>
          ) : (
            <Link to="/login" className="px-3 py-1 bg-sea text-white rounded">Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
