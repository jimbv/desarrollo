import { ExternalUser } from '../user.types';
import { UsersGateway } from '../gateways/users.gateway';
export declare class UsersService {
    private readonly usersGateway;
    constructor(usersGateway: UsersGateway);
    findAll(): Promise<ExternalUser[]>;
}
