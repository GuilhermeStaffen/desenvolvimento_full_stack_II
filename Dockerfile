FROM node:18-slim

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install --only=production

# Install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy all source code
COPY . .

# Build frontend
RUN cd frontend && npm run build

# Remove frontend node_modules after build
RUN rm -rf frontend/node_modules

EXPOSE 3000

CMD ["npm", "start"]