import React from 'react';

export default function Hero(){
  return (
    <section className="relative h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: "url('/src/images/banner_home.jpg')" }}>
      <div className="absolute inset-0 bg-gradient-to-r from-deepsea/70 to-transparent flex items-center">
        <div className="container text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold">Tudo para sua pesca esportiva</h1>
          <p className="mt-2 max-w-lg">Equipamentos premium, atendimento especializado e entrega rápida.</p>
        </div>
      </div>
    </section>
  );
}
