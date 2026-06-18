import { readFile } from 'fs/promises';
import { join } from 'path';

import { ExternalUser } from '../user.types';
import { UsersGateway } from './users.gateway';

export class LocalUsersGateway implements UsersGateway {
  private readonly filePath = join(process.cwd(), 'src/users/data/users.json');

  async fetchAll(): Promise<ExternalUser[]> {
    console.log('LOCAL USERS GATEWAY');
    const data = await readFile(this.filePath, 'utf-8');

    return JSON.parse(data) as ExternalUser[];
  }

  async fetchById(id: number): Promise<ExternalUser> {
    const users = await this.fetchAll();

    const user = users.find((u) => u.id === id);

    if (!user) {
      throw new Error(`User ${id} not found`);
    }

    return user;
  }
}
