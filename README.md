# Projeto Ecommerce pesca

## Como rodar

O projeto possui **backend** (API + Swagger) e **frontend** (Vite).  
Atualmente, **o backend roda em um container Docker**, e o **frontend roda localmente**.

---

### 1. Subindo o backend com Docker

Na pasta raiz do projeto, execute:

```bash
docker compose up -d --build
```

Isso vai:
- Construir a imagem do backend;
- Criar e iniciar o container `fullstackII-backend`;
- Expor a API na porta `3000`.

> Após a execução, a API estará disponível em:  
> http://localhost:3000/api-docs

#### 🔍 Verificando o status do container
```bash
docker ps
```
Deve aparecer algo como:
```
CONTAINER ID   IMAGE                  STATUS         PORTS
a1b2c3d4e5f6   fullstackII-backend    Up 10s         0.0.0.0:3000->3000/tcp
```

#### Visualizar logs em tempo real
```bash
docker compose logs -f backend
```

#### Parar o container
```bash
docker compose down
```

> Se quiser reconstruir a imagem do zero:  
> `docker compose down --rmi all --volumes && docker compose up -d --build`

---

### 2. Rodando o frontend localmente

O frontend **não usa Docker** — rode normalmente com Node.

#### Passos:
1. Instale as dependências:
   ```bash
   cd frontend
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse no navegador:
   👉 http://localhost:5173  
   *(a porta exata aparece no terminal do Vite)*

O frontend se comunica com o backend via:
```
http://localhost:3000
```

---

### 3. Alternativa — rodar tudo localmente (sem Docker)

Se quiser executar backend + frontend fora do Docker (modo desenvolvimento completo):

```bash
# na raiz
npm install
cd frontend && npm install && cd ..
npm run dev:all
```

Acesse:
- Frontend → http://localhost:5173  
- API/Swagger → http://localhost:3000/api-docs

---

## Swagger — Documentação da API

A documentação da API (gerada pelo Swagger) fica disponível em:
**http://localhost:3000/api-docs**

Lá você pode:
- Visualizar todas as rotas da API;
- Executar requisições de teste;
- Ver exemplos de *request* e *response*.

---

### Resumo dos principais comandos

| Ação                          | Comando                          |
|-------------------------------|----------------------------------|
| Subir backend (Docker)        | `docker compose up -d --build`   |
| Parar backend (Docker)        | `docker compose down`            |
| Ver logs do backend           | `docker compose logs -f backend` |
| Subir frontend local          | `cd frontend && npm run dev`     |
| Rodar tudo local (sem Docker) | `npm run dev:all`                |
| Acessar API docs              | http://localhost:3000/api-docs   |
| Acessar frontend              | http://localhost:5173            |

---