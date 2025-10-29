FROM node:18-slim

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install --only=production

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci --only=production

# Copy all source code
COPY . .

# Build frontend
RUN cd frontend && npm run build

EXPOSE 3000

CMD ["npm", "start"]