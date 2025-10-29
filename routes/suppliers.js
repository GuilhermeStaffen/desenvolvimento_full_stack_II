const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');


/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Gerenciamento de fornecedores
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - cnpj
 *         - phone
 *       properties:
 *         id:
 *           type: string
 *           description: ID do fornecedor
 *           example: 123
 *         name:
 *           type: string
 *           description: Nome do fornecedor
 *           example: Fornecedor ABC
 *         email:
 *           type: string
 *           description: E-mail do fornecedor
 *           example: fornecedor@abc.com
 *         cnpj:
 *           type: string
 *           description: CNPJ do fornecedor
 *           example: 12.345.678/0001-99
 *         phone:
 *           type: string
 *           description: Telefone do fornecedor
 *           example: +55 11 99999-9999
 *         website:
 *           type: string
 *           description: Site do fornecedor
 *           example: https://www.abc.com
 *         createdBy:
 *           type: string
 *           description: ID do usuário que criou o fornecedor
 *         updatedBy:
 *           type: string
 *           description: ID do usuário que atualizou o fornecedor
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Cria um novo fornecedor
 *     tags: [Suppliers]
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
 *               - email
 *               - cnpj
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               phone:
 *                 type: string
 *               website:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Campos obrigatórios ausentes
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *
 *   get:
 *     summary: Lista fornecedores com paginação e filtros
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nome
 *       - in: query
 *         name: cnpj
 *         schema:
 *           type: string
 *         description: Filtrar por CNPJ
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de itens por página
 *     responses:
 *       200:
 *         description: Lista paginada de fornecedores
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
 *                     $ref: '#/components/schemas/Supplier'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 */

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Obtém um fornecedor pelo ID
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Detalhes do fornecedor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Fornecedor não encontrado
 *
 *   put:
 *     summary: Atualiza um fornecedor existente
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fornecedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - cnpj
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               cnpj:
 *                 type: string
 *               phone:
 *                 type: string
 *               website:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fornecedor atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supplier'
 *       400:
 *         description: Campos obrigatórios ausentes
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Fornecedor não encontrado
 *
 *   delete:
 *     summary: Exclui um fornecedor
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor excluído com sucesso
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão
 *       404:
 *         description: Fornecedor não encontrado
 */

router.post('/', authMiddleware, authorizeRoles('admin'), supplierController.createSupplier);
router.get('/', authMiddleware, authorizeRoles('admin'), supplierController.getSuppliers);
router.get('/:id', authMiddleware, authorizeRoles('admin'), supplierController.getSupplierById);
router.put('/:id', authMiddleware, authorizeRoles('admin'), supplierController.updateSupplier);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), supplierController.deleteSupplier);

module.exports = router;