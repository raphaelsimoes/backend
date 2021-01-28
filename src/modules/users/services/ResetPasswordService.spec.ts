import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;


describe('ResetPassword', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokenRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();
        resetPassword = new ResetPasswordService(fakeUsersRepository, fakeUserTokenRepository, fakeHashProvider);
    });

    it('should be able to reset the password', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPassword.execute({
            token,
            password: '123123',
        });

        const updatedUser = await fakeUsersRepository.findByID(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });

    it('should not be able to reset the password with a non-existing token', async () => {
        await expect(resetPassword.execute({
            token: 'non-existing-token',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with a non-existing user', async () => {
        const { token } = await fakeUserTokenRepository.generate('non-existing-user');
        
        await expect(resetPassword.execute({
            token,
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password if passed more than 2 hours', async () => {

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(resetPassword.execute({
            token,
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);
    });
});