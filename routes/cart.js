const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Produto Exemplo"
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
 *     Cart:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           example: 5
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         total:
 *           type: number
 *           example: 200.0
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Adiciona um item ao carrinho  (requer login)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       202:
 *         description: Item adicionado ao carrinho
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Erro de validação (produto sem estoque ou campos obrigatórios)
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno
 *
 *   get:
 *     summary: Retorna o carrinho do usuário autenticado  (requer login)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Erro interno
 *
 * /cart/{productId}:
 *   delete:
 *     summary: Remove um item do carrinho  (requer login)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto a ser removido
 *     responses:
 *       200:
 *         description: Item removido do carrinho
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Item não encontrado no carrinho
 *       500:
 *         description: Erro interno
 */


router.post('/', authMiddleware, cartController.addItem);
router.get('/', authMiddleware, cartController.getCart);
router.delete('/:productId', authMiddleware, cartController.removeItem);

module.exports = router;