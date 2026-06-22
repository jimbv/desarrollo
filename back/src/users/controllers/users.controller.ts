import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ExternalUser } from '../user.types';
import { UsersService } from '../services/users.service';

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
}
