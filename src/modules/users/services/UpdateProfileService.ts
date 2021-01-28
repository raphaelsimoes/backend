import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({ user_id, name, email, password, old_password }: IRequest): Promise<User>{
        const user = await this.usersRepository.findByID(user_id);

        if (!user) {
            throw new AppError('Usuário não encontrado.');
        }

        const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
            throw new AppError('E-mail já cadastrado.')
        }

        user.name = name;

        user.email = email;

        if (password && !old_password) {
            throw new AppError('Para alterar a senha, por favor, informe a senha antiga.');
        }

        if (password && old_password) {
            const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);

            if (!checkOldPassword) {
                throw new AppError('Senha atual inválida.');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
        
}

export default UpdateProfileService;