# Frontend estilizado - Loja de Pesca (Tailwind + Vite + React)

## Como rodar

1. Entre na pasta `frontend` criada a partir deste ZIP:
```bash
cd frontend
npm install
npx tailwindcss init -p    # se ainda não inicializou; opcional
npm run dev
```

2. Abra no navegador `http://localhost:5173` (porta do Vite mostrada no terminal).

3. Certifique-se de que o backend está rodando na raiz do projeto em `http://localhost:3000` com as rotas API (`/api/products`, `/api/auth/login`, `/api/users`, `/api/cart`).

## Observações
- Coloque imagens locais em `src/images/` (placeholder e banner) ou use URLs externas no campo `imagem` dos produtos.
- Se necessário eu adapto `src/services/api.js` para o formato exato de respostas do backend.
