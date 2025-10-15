const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authController = require('../controllers/authController');

jest.mock('../models', () => ({
    User: {
        scope: jest.fn(() => ({
            findOne: jest.fn(),
        })),
    },
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe('authController.login', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it('deve retornar 400 se email ou password não forem enviados', async () => {
        await authController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email e password são obrigatórios.' });
    });

    it('deve retornar 401 se o usuário não for encontrado', async () => {
        req.body = { email: 'teste@exemplo.com', password: '123' };
        User.scope().findOne.mockResolvedValue(null);

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Usuário ou senha inválidos' });
    });

    it('deve retornar 401 se a senha for inválida', async () => {
        const fakeUser = {
            checkPassword: jest.fn().mockResolvedValue(false),
        };
        req.body = { email: 'teste@exemplo.com', password: '123' };
        User.scope().findOne.mockResolvedValue(fakeUser);

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Usuário ou senha inválidos' });
    });

    it('deve retornar 202 e token se login for válido', async () => {
        const fakeUser = {
            checkPassword: jest.fn().mockResolvedValue(true),
            toJSON: jest.fn().mockReturnValue({ id: 1, email: 'teste@exemplo.com', password: 'hashed' }),
        };

        const mockFindOne = jest.fn().mockResolvedValue(fakeUser);
        User.scope.mockReturnValue({ findOne: mockFindOne });

        req.body = { email: 'teste@exemplo.com', password: '123' };
        jwt.sign.mockReturnValue('fake-token');

        await authController.login(req, res);

        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 1, email: 'teste@exemplo.com' },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        expect(res.status).toHaveBeenCalledWith(202);
        expect(res.json).toHaveBeenCalledWith({
            token: 'fake-token',
            user: { id: 1, email: 'teste@exemplo.com' },
        });
    });

    it('deve retornar 500 em caso de erro inesperado', async () => {
        req.body = { email: 'teste@exemplo.com', password: '123' };
        User.scope().findOne.mockRejectedValue(new Error('DB error'));

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro interno' });
    });
});