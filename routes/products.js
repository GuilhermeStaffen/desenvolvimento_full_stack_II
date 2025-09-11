const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');
/**
 * @swagger
 * components:
 *   schemas:
 *     ProductImage:
 *       type: object
 *       required:
 *         - url
 *       properties:
 *         url:
 *           type: string
 *           example: "https://meusite.com/imagem1.jpg"
 *
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - quantity
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Produto Exemplo"
 *         price:
 *           type: number
 *           example: 120.5
 *         quantity:
 *           type: integer
 *           example: 10
 *         description:
 *           type: string
 *           example: "Descrição do produto exemplo"
 *         images:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductImage'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 * /products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtra produtos pelo nome
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Quantidade por página
 *     responses:
 *       200:
 *         description: Lista paginada de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *
 *   post:
 *     summary: Cria um novo produto (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - quantity
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Produto Exemplo"
 *               price:
 *                 type: number
 *                 example: 120.5
 *               quantity:
 *                 type: integer
 *                 example: 10
 *               description:
 *                 type: string
 *                 example: "Descrição do produto exemplo"
 *               images:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProductImage'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Erro de validação (campos obrigatórios ou duplicados)
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário sem permissão (não é admin)
 *       500:
 *         description: Erro interno
 *
 * /products/{id}:
 *   get:
 *     summary: Busca um produto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno
 *
 *   put:
 *     summary: Atualiza um produto existente (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Produto Atualizado"
 *               price:
 *                 type: number
 *                 example: 150.0
 *               quantity:
 *                 type: integer
 *                 example: 5
 *               description:
 *                 type: string
 *                 example: "Descrição atualizada do produto"
 *               images:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProductImage'
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário sem permissão (não é admin)
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno
 *
 *   delete:
 *     summary: Remove um produto (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedID:
 *                   type: integer
 *                 message:
 *                   type: string
 *       401:
 *         description: Usuário não autenticado
 *       403:
 *         description: Usuário sem permissão (não é admin)
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno
 */

router.post('/', authMiddleware, authorizeRoles('admin'), productController.create);
router.get('/', productController.list);
router.get('/:id', productController.getById);
router.put('/:id', authMiddleware, authorizeRoles('admin'), productController.update);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), productController.remove);

module.exports = router;
