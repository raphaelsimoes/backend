import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
    user_id: string;
    avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService{
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute({ user_id, avatarFilename }: IRequest): Promise<User>{

        const user = await this.usersRepository.findByID(user_id);

        if (!user) {
            throw new AppError('Somente usuários autenticados podem atualizar seu avatar.', 401);
        }

        if (user.avatar) {
            this.storageProvider.deleteFile(user.avatar);
        }

        const fileName = await this.storageProvider.saveFile(avatarFilename);

        user.avatar = fileName;

        await this.usersRepository.save(user);

        return user;
    }
        
}

export default UpdateUserAvatarService;