// backend/config/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Configuração centralizada do Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - Desenvolvimento Full Stack II",
      version: "1.0.0",
      description: "Documentação gerada automaticamente pelo Swagger",
    },
    servers: [
      {
        url: "http://localhost:5000", // sem barra no final
        description: "Servidor local",
      },
    ],
  },
  apis: ["./routes/*.js"], // caminhos das rotas
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app) {
  // Proteção extra: se algo der erro de rota, não interrompe o servidor
  try {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("✅ Swagger disponível em: http://localhost:5000/api-docs");
  } catch (error) {
    console.warn("⚠️ Swagger desativado temporariamente devido a erro:", error.message);
  }
}

module.exports = swaggerDocs;
