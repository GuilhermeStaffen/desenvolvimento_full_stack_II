const { User } = require('../models');
const userController = require('../controllers/userController');

jest.mock('../models', () => ({
    User: {
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        destroy: jest.fn(),
    },
}));

describe('userController', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {}, params: {}, user: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it('deve retornar 400 se campos obrigatórios estiverem ausentes', async () => {
        req.body = { name: '', email: '', password: '', address: {} };
        await userController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Name, email, endereço e password são obrigatórios.',
        });
    });

    it('deve criar usuário com sucesso', async () => {
        const fakeUser = {
            toJSON: jest.fn().mockReturnValue({
                id: 1,
                name: 'Teste',
                email: 'teste@exemplo.com',
                password: 'hashed',
                phone: '9999',
                street: 'Rua A',
                number: '10',
                city: 'SP',
                state: 'SP',
                zipcode: '12345',
                country: 'Brasil',
            }),
        };

        User.create.mockResolvedValue(fakeUser);

        req.body = {
            name: 'Teste',
            email: 'teste@exemplo.com',
            password: '123',
            phone: '9999',
            address: {
                street: 'Rua A',
                number: '10',
                city: 'SP',
                state: 'SP',
                zipcode: '12345',
                country: 'Brasil',
            },
        };

        await userController.create(req, res);

        expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Teste',
            email: 'teste@exemplo.com',
            phone: '9999',
            street: 'Rua A',
        }));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: 1,
            name: 'Teste',
            email: 'teste@exemplo.com',
            address: expect.objectContaining({ street: 'Rua A' }),
        }));
    });


    it('deve retornar 403 se o usuário não tiver permissão', async () => {
        req.user = { id: 2, userType: 'user' };
        req.params = { id: '1' };
        await userController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado.' });
    });

    it('deve retornar 404 se usuário não for encontrado', async () => {
        req.user = { id: 1, userType: 'user' };
        req.params = { id: '1' };
        User.findByPk.mockResolvedValue(null);

        await userController.update(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado.' });
    });

    it('deve atualizar usuário com sucesso', async () => {
        const fakeUser = {
            name: 'Antigo',
            update: jest.fn(),
            toJSON: jest.fn().mockReturnValue({
                id: 1,
                name: 'Novo Nome',
                email: 'teste@exemplo.com',
                street: 'Rua B',
                number: '20',
                city: 'SP',
                state: 'SP',
                zipcode: '12345',
                country: 'Brasil',
            }),
        };

        req.user = { id: 1, userType: 'user' };
        req.params = { id: '1' };
        req.body = { name: 'Novo Nome', address: { street: 'Rua B' } };

        User.findByPk.mockResolvedValue(fakeUser);

        await userController.update(req, res);

        expect(fakeUser.update).toHaveBeenCalledWith(expect.objectContaining({ name: 'Novo Nome' }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1, name: 'Novo Nome' }));
    });

    it('deve listar usuários formatados', async () => {
        const fakeUsers = [
            {
                toJSON: () => ({
                    id: 1,
                    name: 'User 1',
                    email: 'u1@x.com',
                    street: 'Rua 1',
                    number: '10',
                    city: 'SP',
                    state: 'SP',
                    zipcode: '00000',
                    country: 'BR',
                }),
            },
        ];
        User.findAll.mockResolvedValue(fakeUsers);

        await userController.list(req, res);

        expect(res.json).toHaveBeenCalledWith([
            expect.objectContaining({
                id: 1,
                name: 'User 1',
                address: expect.objectContaining({ street: 'Rua 1' }),
            }),
        ]);
    });

    it('deve retornar 403 se usuário não tiver permissão', async () => {
        req.user = { id: 2, userType: 'user' };
        req.params = { id: '1' };
        await userController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Acesso negado.' });
    });

    it('deve retornar 404 se usuário não existir', async () => {
        req.user = { id: 1, userType: 'admin' };
        req.params = { id: '1' };
        User.findByPk.mockResolvedValue(null);

        await userController.getById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('deve retornar dados formatados do usuário', async () => {
        const fakeUser = {
            toJSON: () => ({
                id: 1,
                name: 'User 1',
                email: 'u1@x.com',
                street: 'Rua 1',
                number: '10',
                city: 'SP',
                state: 'SP',
                zipcode: '00000',
                country: 'BR',
            }),
        };

        req.user = { id: 1, userType: 'user' };
        req.params = { id: '1' };
        User.findByPk.mockResolvedValue(fakeUser);

        await userController.getById(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: 1,
            name: 'User 1',
            address: expect.objectContaining({ street: 'Rua 1' }),
        }));
    });

    it('deve retornar 404 se usuário não for encontrado ao remover', async () => {
        req.params = { id: '1' };
        User.destroy.mockResolvedValue(0);

        await userController.remove(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado.' });
    });

    it('deve remover usuário com sucesso', async () => {
        req.params = { id: '1' };
        User.destroy.mockResolvedValue(1);

        await userController.remove(req, res);

        expect(res.json).toHaveBeenCalledWith({ deletedID: '1' });
    });


    it('deve retornar 500 se ocorrer erro inesperado no create', async () => {
        User.create.mockRejectedValue(new Error('DB error'));
        req.body = { name: 'X', email: 'x', password: 'x', address: { street: 'Y', number: '1', city: 'C', state: 'S', zipcode: 'Z', country: 'P' } };
        await userController.create(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });

    it('deve retornar 500 se ocorrer erro inesperado no update', async () => {
        User.findByPk.mockRejectedValue(new Error('DB error'));
        req.user = { id: 1, userType: 'admin' };
        req.params = { id: '1' };
        await userController.update(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });

    it('deve retornar 500 se ocorrer erro inesperado no list', async () => {
        User.findAll.mockRejectedValue(new Error('DB error'));
        await userController.list(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });

    it('deve retornar 500 se ocorrer erro inesperado no getById', async () => {
        User.findByPk.mockRejectedValue(new Error('DB error'));
        req.user = { id: 1, userType: 'admin' };
        req.params = { id: '1' };
        await userController.getById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });

    it('deve retornar 500 se ocorrer erro inesperado no remove', async () => {
        User.destroy.mockRejectedValue(new Error('DB error'));
        req.params = { id: '1' };
        await userController.remove(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });

});
