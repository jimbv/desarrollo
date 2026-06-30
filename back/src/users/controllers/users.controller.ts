import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserRole } from '../user-role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UpdateEmailDto } from '../dto/update-email.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  updateMyPassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    return this.usersService.updateMyPassword(req.user.id, dto.currentPassword, dto.newPassword);
  }

  @Patch('me/email')
  @UseGuards(JwtAuthGuard)
  updateMyEmail(@Req() req, @Body() dto: UpdateEmailDto) {
    return this.usersService.updateMyEmail(req.user.id, dto.password, dto.newEmail);
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateRole(@Req() req, @Param('id') id: string, @Body('role') role: UserRole) {
    return this.usersService.updateRole(id, role, req.user.id);
  }
}