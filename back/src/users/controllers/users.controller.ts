import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ExternalUser } from '../user.types';
import { UsersService } from '../services/users.service';
import { UserRole } from '../user-role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<ExternalUser[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ExternalUser> {
    return this.usersService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: any) {
    console.log('Datos recibidos:', body);

    return{
      mensaje: "Usuario creado exitosamente",
      data: body,
    };
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ) {
    return this.usersService.updateRole(id, role);
  }
}
