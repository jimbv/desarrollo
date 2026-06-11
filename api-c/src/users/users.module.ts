import { Global, Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { JsonPlaceholderUsersGateway } from './gateways/jsonplaceholder-users.gateway';
import { USERS_GATEWAY } from './gateways/users.gateway';
import { UsersService } from './services/users.service';

@Global()
@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: USERS_GATEWAY, useClass: JsonPlaceholderUsersGateway },
  ],
  exports: [UsersService, USERS_GATEWAY],
})
export class UsersModule {}
