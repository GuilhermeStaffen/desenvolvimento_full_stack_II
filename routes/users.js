const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de gerenciamento de usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Address:
 *       type: object
 *       required:
 *         - street
 *         - number
 *         - city
 *         - state
 *         - zipcode
 *         - country
 *       properties:
 *         street:
 *           type: string
 *           example: Rua das Flores
 *         number:
 *           type: string
 *           example: 123
 *         city:
 *           type: string
 *           example: São Paulo
 *         state:
 *           type: string
 *           example: SP
 *         zipcode:
 *           type: string
 *           example: 01000-000
 *         country:
 *           type: string
 *           example: Brasil
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: João Silva
 *         email:
 *           type: string
 *           example: joao@email.com
 *         userType:
 *           type: string
 *           example: customer
 *         phone:
 *           type: string
 *           example: "+55 11 99999-8888"
 *         address:
 *           $ref: '#/components/schemas/Address'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Criar um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               phone:
 *                 type: string
 *                 example: "+55 11 99999-8888"
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno
 *
 *   get:
 *     summary: Listar todos os usuários (apenas admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Buscar usuário por ID (próprio ou admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno
 *
 *   put:
 *     summary: Atualizar um usuário (próprio ou admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: João da Silva
 *               email:
 *                 type: string
 *                 example: joao@novoemail.com
 *               password:
 *                 type: string
 *                 example: novaSenha123
 *               phone:
 *                 type: string
 *                 example: "+55 11 98888-7777"
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno
 *
 *   delete:
 *     summary: Remover um usuário (apenas admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno
 */

router.post('/', userController.create);
router.get('/', authMiddleware, authorizeRoles('admin'),userController.list);
router.get('/:id', authMiddleware,userController.getById);
router.put('/:id', authMiddleware, userController.update);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), userController.remove);

module.exports = router;