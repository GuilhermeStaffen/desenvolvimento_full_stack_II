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
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Logo Loja de Pesca" className="h-10 w-auto" />
          <div className="text-2xl font-extrabold text-sea select-none">PescaPro</div>
        </Link>

        <nav className="flex items-center gap-8 text-gray-700">
          <Link
            to="/"
            className="hover:text-sea font-medium transition duration-150"
            aria-label="Página de Produtos"
          >
            Produtos
          </Link>
          <Link
            to="/meus-pedidos"
            className="hover:text-sea font-medium transition duration-150"
            aria-label="Página de Pedidos"
          >
            Pedidos
          </Link>
          <Link
            to="/carrinho"
            className="hover:text-sea font-medium transition duration-150"
            aria-label="Carrinho de compras"
          >
            Carrinho
            <span className="ml-1 bg-sea text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </Link>

          {user ? (
            <>
              <Link
                to="/perfil"
                className="hover:text-sea font-medium transition duration-150"
                aria-label="Perfil do usuário"
              >
                Olá, {user.name}
              </Link>
              {user.userType === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="hover:text-sea font-medium transition duration-150"
                  aria-label="Página Admin"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  nav("/");
                }}
                className="ml-4 px-4 py-2 bg-highlight text-white rounded-xl font-semibold hover:bg-highlight focus:outline-none focus:ring-2 focus:ring-highlight transition"
                aria-label="Sair da conta"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-sea text-white rounded-xl font-semibold hover:bg-sea focus:outline-none focus:ring-2 focus:ring-sea transition"
              aria-label="Entrar na conta"
            >
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}