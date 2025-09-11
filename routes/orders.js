const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 2
 *         unitPrice:
 *           type: number
 *           example: 50.0
 *         subtotal:
 *           type: number
 *           example: 100.0
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 10
 *         userId:
 *           type: integer
 *           example: 5
 *         status:
 *           type: string
 *           enum: [placed, shipped, delivered, canceled]
 *           example: placed
 *         total:
 *           type: number
 *           example: 200.5
 *         fullAddress:
 *           type: string
 *           example: "Rua A, 123, São Paulo, SP, 01000-000, Brasil"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *
 *     PaginatedOrders:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         totalItems:
 *           type: integer
 *           example: 20
 *         totalPages:
 *           type: integer
 *           example: 2
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           example: "Produto não encontrado"
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: "Cria um novo pedido (requer login)"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: "Pedido criado com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: "Erro de validação (ex.: itens inválidos ou estoque insuficiente)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: "Erro interno"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   get:
 *     summary: "Lista todos os pedidos (admin)"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Página da listagem"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Quantidade por página"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [placed, shipped, delivered, canceled]
 *         description: "Filtrar por status do pedido"
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: "Filtrar por ID do usuário"
 *     responses:
 *       200:
 *         description: "Lista paginada de pedidos"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOrders'
 *       403:
 *         description: "Acesso negado. Apenas administradores."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: "Nenhum pedido encontrado"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: "Erro interno"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /orders/my-orders:
 *   get:
 *     summary: "Lista pedidos do usuário autenticado (requer login)"
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: "Página da listagem"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Quantidade por página"
 *     responses:
 *       200:
 *         description: "Lista de pedidos do usuário"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOrders'
 *       404:
 *         description: "Nenhum pedido encontrado"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: "Erro interno"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


router.post('/', authMiddleware, orderController.create);
router.get('/my-orders', authMiddleware, orderController.myOrders);
router.get('/', authMiddleware, authorizeRoles('admin'), orderController.getAll);

module.exports = router;