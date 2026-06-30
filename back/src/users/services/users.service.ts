import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Resend } from 'resend';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user.entity';
import { UserRole } from '../user-role.enum';

@Injectable()
export class UsersService {
  private readonly resend: Resend;

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly cfg: ConfigService,
  ) {
    const apiKey = this.cfg.get<string>('RESEND_API_KEY') ?? 're_mock_123';
    this.resend = new Resend(apiKey);
  }

  async findAll() {
    const users = await this.usersRepo.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    }));
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }

  async updateRole(id: string, role: UserRole, currentUserId?: string) {
    if (!Object.values(UserRole).includes(role)) {
      throw new BadRequestException('Invalid role');
    }

    if (currentUserId && id === currentUserId) {
      throw new ForbiddenException('Cannot change your own role');
    }

    const user = await this.usersRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = role;

    const savedUser = await this.usersRepo.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
      isVerified: savedUser.isVerified,
      createdAt: savedUser.createdAt,
    };
  }

  async updateMyPassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!ok) {
      throw new BadRequestException('Current password is incorrect');
    }

    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    user.passwordHash = await bcrypt.hash(newPassword, rounds);

    await this.usersRepo.save(user);

    return {
      message: 'Password updated successfully',
    };
  }

  async updateMyEmail(
    userId: string,
    currentPassword: string,
    newEmail: string,
  ) {
    const normalizedEmail = newEmail.trim().toLowerCase();

    const existingUser = await this.usersRepo.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('Email already in use');
    }

    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!ok) {
      throw new BadRequestException('Current password is incorrect');
    }

    const verificationToken = randomUUID();
    const verificationTokenExpires = new Date(
      Date.now() + 1000 * 60 * 60 * 24,
    );

    user.email = normalizedEmail;
    user.isVerified = false;
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;

    const savedUser = await this.usersRepo.save(user);

    const frontendUrl =
      this.cfg.get<string>('FRONTEND_URL') ?? 'http://localhost:4200';

    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;
    const fromEmail =
      this.cfg.get<string>('MAIL_FROM') ?? 'onboarding@resend.dev';

    this.resend.emails
      .send({
        from: fromEmail,
        to: savedUser.email,
        subject: 'Verify your new email',
        html: `
          <h1>Verify your new email</h1>
          <p>Please verify your new email address by clicking the link below:</p>
          <p><a href="${verificationLink}">Verify email</a></p>
          <p>${verificationLink}</p>
        `,
      })
      .catch((err) => {
        console.error('Error enviando email de verificacion:', err);
      });

    return {
      message: 'Email updated successfully. Please verify your new email.',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        isVerified: savedUser.isVerified,
        createdAt: savedUser.createdAt,
      },
    };
  }
}