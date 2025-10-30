const supplierController = require('../controllers/supplierController');
const Supplier = require('../models/Supplier');

jest.mock('../models/Supplier', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn(),
  hasMany: jest.fn(),
}));

jest.mock('../models/Product', () => ({
  belongsTo: jest.fn(),
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Supplier Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    req = { body: {}, params: {}, query: {}, user: { id: 1 } };
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('createSupplier', () => {
    it('deve criar um fornecedor com sucesso', async () => {
      req.body = {
        name: 'Fornecedor Teste',
        email: 'teste@fornecedor.com',
        cnpj: '1234567890001',
        phone: '999999999',
        website: 'www.teste.com'
      };

      const fakeSupplier = { id: 1, ...req.body };
      Supplier.create.mockResolvedValue(fakeSupplier);

      await supplierController.createSupplier(req, res);

      expect(Supplier.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Fornecedor Teste',
        email: 'teste@fornecedor.com',
        cnpj: '1234567890001',
        phone: '999999999',
        website: 'www.teste.com',
        createdBy: 1,
        updatedBy: 1
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeSupplier);
    });

    it('deve retornar erro 400 se faltar campos obrigatórios', async () => {
      req.body = { name: 'Teste' };
      await supplierController.createSupplier(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nome, email, cnpj e telefone são obrigatórios'
      });
    });

    it('deve retornar erro 500 se ocorrer falha no banco', async () => {
      req.body = {
        name: 'Fornecedor Teste',
        email: 'teste@fornecedor.com',
        cnpj: '1234567890001',
        phone: '999999999'
      };
      Supplier.create.mockRejectedValue(new Error('Erro simulado'));

      await supplierController.createSupplier(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao cadastrar fornecedor' });
    });
  });

  describe('getSuppliers', () => {
    it('deve listar fornecedores com sucesso', async () => {
      req.query = { page: 1, limit: 2 };
      const suppliers = [{ id: 1 }, { id: 2 }];
      Supplier.count.mockResolvedValue(2);
      Supplier.findAll.mockResolvedValue(suppliers);

      await supplierController.getSuppliers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        totalItems: 2,
        totalPages: 1,
        items: suppliers
      }));
    });

    it('deve retornar erro 500 em caso de falha', async () => {
      Supplier.count.mockRejectedValue(new Error('Erro simulado'));
      await supplierController.getSuppliers(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao consultar fornecedores' });
    });
  });

  describe('getSupplierById', () => {
    it('deve retornar fornecedor encontrado', async () => {
      req.params.id = 1;
      const supplier = { id: 1, name: 'Fornecedor Teste' };
      Supplier.findByPk.mockResolvedValue(supplier);

      await supplierController.getSupplierById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(supplier);
    });

    it('deve retornar 404 se fornecedor não existir', async () => {
      req.params.id = 1;
      Supplier.findByPk.mockResolvedValue(null);

      await supplierController.getSupplierById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Fornecedor não encontrado' });
    });

    it('deve retornar erro 500 em caso de exceção', async () => {
      Supplier.findByPk.mockRejectedValue(new Error('Erro'));
      await supplierController.getSupplierById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao consultar fornecedor' });
    });
  });

  describe('updateSupplier', () => {
    it('deve atualizar fornecedor com sucesso', async () => {
      req.params.id = 1;
      req.body = {
        name: 'Fornecedor Atualizado',
        email: 'novo@teste.com',
        cnpj: '123',
        phone: '8888',
        website: 'site.com'
      };

      const supplier = { id: 1, update: jest.fn().mockResolvedValue() };
      Supplier.findByPk.mockResolvedValue(supplier);

      await supplierController.updateSupplier(req, res);
      expect(supplier.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(supplier);
    });

    it('deve retornar 400 se faltar campos obrigatórios', async () => {
      req.body = { name: 'Incompleto' };
      await supplierController.updateSupplier(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('deve retornar 404 se fornecedor não encontrado', async () => {
      req.params.id = 1;
      req.body = {
        name: 'Fornecedor Atualizado',
        email: 'novo@teste.com',
        cnpj: '123',
        phone: '8888'
      };
      Supplier.findByPk.mockResolvedValue(null);

      await supplierController.updateSupplier(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Fornecedor não encontrado.' });
    });

    it('deve retornar erro 500 em caso de exceção', async () => {
      Supplier.findByPk.mockRejectedValue(new Error('Erro simulado'));
      req.params.id = 1;
      req.body = {
        name: 'Fornecedor Atualizado',
        email: 'novo@teste.com',
        cnpj: '123',
        phone: '8888'
      };
      await supplierController.updateSupplier(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteSupplier', () => {
    it('deve excluir fornecedor com sucesso', async () => {
      req.params.id = 1;
      Supplier.destroy.mockResolvedValue(1);

      await supplierController.deleteSupplier(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Fornecedor excluído' });
    });

    it('deve retornar 404 se fornecedor não encontrado', async () => {
      req.params.id = 1;
      Supplier.destroy.mockResolvedValue(0);

      await supplierController.deleteSupplier(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Fornecedor não encontrado' });
    });

    it('deve retornar 500 se ocorrer erro no banco', async () => {
      Supplier.destroy.mockRejectedValue(new Error('Erro simulado'));
      await supplierController.deleteSupplier(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Falha ao excluir fornecedor' });
    });
  });
});
