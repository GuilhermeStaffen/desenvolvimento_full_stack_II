# Imagem leve do Node
FROM node:18-alpine

# Diretório de trabalho
WORKDIR /app

# Dependências (aproveita cache)
COPY package*.json ./
# Produção (se precisar de dev deps, troque para `npm install`)
RUN npm ci --omit=dev

# Copia o restante do backend
COPY . .

# Variáveis padrão (podem ser sobrescritas no compose)
ENV NODE_ENV=production \
    PORT=3000

# Expõe a porta do backend
EXPOSE 3000

# Sobe a API
# Se seu entrypoint for outro script, ajuste aqui (ex.: "npm start")
CMD ["npm","start"]