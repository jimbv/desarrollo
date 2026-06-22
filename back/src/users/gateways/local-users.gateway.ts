import { NotFoundException } from '@nestjs/common';
import users from '../data/users.json';
import { ExternalUser } from '../user.types';
import { UsersGateway } from './users.gateway';

export class LocalUsersGateway implements UsersGateway {
  async fetchAll(): Promise<ExternalUser[]> {
    return users;
  }

  async fetchById(id: number): Promise<ExternalUser> {
    const user = users.find((u) => u.id === id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}