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
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
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
 *
 *     UpdateQuantityRequest:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: integer
 *           description: Quantidade final desejada para o produto no carrinho. Se 0 => item será removido.
 *           example: 3
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
 * /cart:
 *   post:
 *     summary: "Adiciona um item ao carrinho (requer login)"
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
 *       200:
 *         description: "Carrinho atualizado (item adicionado)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: "Erro de validação (produto sem estoque ou campos obrigatórios)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: "Produto não encontrado"
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
 *     summary: "Retorna o carrinho do usuário autenticado (requer login)"
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Carrinho do usuário"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: "Erro interno"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /cart/{productId}:
 *   put:
 *     summary: "Atualiza a quantidade de um item no carrinho (idempotente) (requer login)"
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID do produto a ser atualizado"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateQuantityRequest'
 *     responses:
 *       200:
 *         description: "Carrinho atualizado (quantidade ajustada). Se quantity = 0, item é removido."
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: "Erro de validação (ex: quantity inválido)"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: "Produto não encontrado"
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
 *   delete:
 *     summary: "Remove um item do carrinho (requer login)"
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: "ID do produto a ser removido"
 *     responses:
 *       200:
 *         description: "Item removido do carrinho — retorna o carrinho atualizado"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: "Item não encontrado no carrinho"
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


router.post('/', authMiddleware, cartController.addItem);            
router.get('/', authMiddleware, cartController.getCart);               
router.put('/:productId', authMiddleware, cartController.updateItem);   
router.delete('/:productId', authMiddleware, cartController.removeItem);

module.exports = router;


