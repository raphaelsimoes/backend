import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeEmailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeEmailProvider: FakeEmailProvider;
let fakeUserTokenRepository: FakeUserTokensRepository;
let sendForgotPasswordEMail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeEmailProvider = new FakeEmailProvider();
        fakeUserTokenRepository = new FakeUserTokensRepository();
        sendForgotPasswordEMail = new SendForgotPasswordEmailService(fakeUsersRepository, fakeEmailProvider, fakeUserTokenRepository);
    });

    it('should be able to recover the password using email', async () => {
        const sendMail = jest.spyOn(fakeEmailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await sendForgotPasswordEMail.execute({
            email: 'johndoe@example.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async () => {
        await expect(sendForgotPasswordEMail.execute({
            email: 'johndoe@example.com',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {

        const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await sendForgotPasswordEMail.execute({
            email: 'johndoe@example.com',
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});