import { ExternalUser } from '../user.types';
import { UsersService } from '../services/users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<ExternalUser[]>;
    findById(id: number): Promise<ExternalUser>;
}
