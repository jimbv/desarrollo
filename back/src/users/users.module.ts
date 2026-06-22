import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { JsonPlaceholderUsersGateway } from './gateways/jsonplaceholder-users.gateway';
import { USERS_GATEWAY } from './gateways/users.gateway';
import { UsersService } from './services/users.service';
import { UserEntity } from './user.entity';
import { LocalUsersGateway } from './gateways/local-users.gateway';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USERS_GATEWAY,
      useFactory: () => {
        return process.env.USERS_SOURCE === 'local'
          ? new LocalUsersGateway()
          : new JsonPlaceholderUsersGateway();
      },
    },
  ],
  exports: [UsersService, USERS_GATEWAY],
})
export class UsersModule {}