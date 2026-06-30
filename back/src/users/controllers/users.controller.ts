import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserRole } from '../user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    console.log('Datos recibidos:', body);

    return{
      mensaje: "Usuario creado exitosamente",
      data: body,
    };
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  updateMyPassword(
    @Req() req,
    @Body () body: { currentPassword: string; newPassword: string },
  )
  {
    return this.usersService.updateMyPassword(req.user.id, body.currentPassword, body.newPassword);
  }

  @Patch('me/email')
  @UseGuards(JwtAuthGuard)
  updateMyEmail(
    @Req() req,
    @Body() body: { currentPassword: string; newEmail: string },
  )
  {
    return this.usersService.updateMyEmail(req.user.id, body.currentPassword, body.newEmail);
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ) {
    return this.usersService.updateRole(id, role);
  }
}
