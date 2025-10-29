const Supplier = require('../models/Supplier');

const supplierController = {

    async createSupplier(req, res) {
        try {
            const { name, email, cnpj, phone, website } = req.body;

            if (!name || !email || !cnpj || !phone) {
                return res.status(400).json({ error: 'Nome, email, cnpj e telefone são obrigatórios' });
            }

            const supplier = await Supplier.create({
                name,
                email,
                cnpj,
                phone,
                website,
                createdBy: req.user.id,
                updatedBy: req.user.id
            });

            return res.status(201).json(supplier);
        } catch (error) {
            res.status(500).json({ error: "Falha ao cadastrar fornecedor" });
        }
    },


    async getSuppliers(req, res) {
        try {
            const { name, cnpj, page = 1, limit = 10 } = req.query;
            const where = {};

            if (name) where.name = { [Op.like]: `%${name}%` };
            if (cnpj) where.price = price;

            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);
            const offset = (pageNumber - 1) * limitNumber;

            const totalItems = await Supplier.count({ where });

            const suppliers = await Supplier.findAll({
                where,
                limit: limitNumber,
                offset
            });

            const totalPages = Math.ceil(totalItems / limitNumber);

            return res.status(200).json({
                page: pageNumber,
                limit: limitNumber,
                totalItems,
                totalPages,
                items: suppliers
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Falha ao consultar fornecedores" });
        }
    },


    async getSupplierById(req, res) {
        try {
            const { id } = req.params;
            const supplier = await Supplier.findByPk(id);
            if (!supplier) return res.status(404).json({ error: 'Fornecedor não encontrado' });
            return res.status(200).json(supplier);
        } catch (error) {
            res.status(500).json({ error: "Falha ao consultar fornecedor" });
        }
    },


    async updateSupplier(req, res) {
        try {
            const { id } = req.params;
            const { name, email, cnpj, phone, website } = req.body;
            if (!name || !email || !cnpj || !phone) {
                return res.status(400).json({ error: 'Nome, email, cnpj e telefone são obrigatórios' });
            }

            const supplier = await Supplier.findByPk(id);
            if (!supplier) return res.status(404).json({ error: 'Fornecedor não encontrado.' });

            await supplier.update({
                name: name ?? supplier.name,
                email: email ?? supplier.email,
                cnpj: cnpj ?? supplier.cnpj,
                phone: phone ?? supplier.phone,
                website: website ?? supplier.website,
                updatedBy: req.user.id
            });
        
            return res.status(200).json(supplier);
        } catch (error) {
            res.status(500).json({ error: "Falha ao atualizar fornecedor" });
        }
    },

    async deleteSupplier(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Supplier.destroy({ where: { id } });
            if (!deleted) return res.status(404).json({ error: 'Fornecedor não encontrado' });
            return res.status(200).json({ message: 'Fornecedor excluído' });
        } catch (error) {
            res.status(500).json({ error: 'Falha ao excluir fornecedor' });
        }
    }
};
module.exports = supplierController;