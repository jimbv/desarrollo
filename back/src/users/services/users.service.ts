import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExternalUser } from '../user.types';
import { USERS_GATEWAY } from '../gateways/users.gateway';
import type { UsersGateway } from '../gateways/users.gateway';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_GATEWAY)
    private readonly usersGateway: UsersGateway,
  ) {}

  async findAll(): Promise<ExternalUser[]> {
    try {
      return await this.usersGateway.fetchAll();
    } catch {
      throw new BadGatewayException('Upstream users service failed');
    }
  }

  async findById(id: number): Promise<ExternalUser> {
    try {
      return await this.usersGateway.fetchById(id);
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new NotFoundException('User not found');
      }
      throw new BadGatewayException('Upstream users service failed');
    }
  }
}
