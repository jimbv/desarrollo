import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../users/user.entity';
import { UserRole } from '../users/user-role.enum';
import { randomUUID } from 'crypto'; // Para generar el token único
import { Resend } from 'resend'; // SDK oficial de Resend

@Injectable()
export class AuthService {
  private readonly resend: Resend;

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly cfg: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    const apiKey = this.cfg.get<string>('RESEND_API_KEY') ?? 're_mock_123';
    this.resend = new Resend(apiKey);
  }

  async register(email: string, password: string) {
    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    const passwordHash = await bcrypt.hash(password, rounds);

    const countUsers = await this.usersRepo.count();
    const role = countUsers === 0 ? UserRole.ADMIN : UserRole.USER;

    // 1. Generamos el token único de verificación
    const verificationToken = randomUUID();

    const verificationTokenExpires = new Date(
      Date.now() + 1000 * 60 * 60 * 24,
    ); // 24 horas de expiracion
    
    const entity = this.usersRepo.create({
      email: email.trim().toLowerCase(),
      passwordHash,
      role,
      verificationToken,
      verificationTokenExpires,
      isVerified: false, // Inicialmente no verificado
    });

    let savedUser: UserEntity;

    try {
      savedUser = await this.usersRepo.save(entity);
    } catch {
      throw new ConflictException('El email ya está registrado');
    }


    // 2. Construimos el link de verificación para el correo
    const frontendUrl = this.cfg.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    // 3. Enviamos el mail con Resend de forma asíncrona (sin bloquear la respuesta)
    const fromEmail = this.cfg.get<string>('MAIL_FROM') ?? 'onboarding@resend.dev';
    
    this.resend.emails.send({
      from: fromEmail,
      to: savedUser.email,
      subject: 'Verifica tu cuenta',
      html: `
        <h1>¡Bienvenido!</h1>
        <p>Gracias por registrarte. Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
        <p><a href="${verificationLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verificar mi correo</a></p>
        <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p>${verificationLink}</p>
      `,
    }).catch(err => {
      // Manejo de error silencioso para que la app no se caiga si falla el envío de mail en dev
      console.error('Error enviando email con Resend:', err);
    });

    // 4. Devolvemos la response limpia (Sin token de acceso, cumpliendo la consigna)
    return {
      message: 'Usuario registrado exitosamente. Por favor, verifica tu correo electrónico.',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      },
    };
    
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email: email.trim().toLowerCase() })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
      access_token: accessToken,
    };
  }

  async verifyEmail(token: string) {
    const user = await this.usersRepo.findOne({
      where: { verificationToken: token },
    });

    if (!user || !user.verificationTokenExpires) {
      throw new BadRequestException('Token de verificacion inválido o inexistente');
    }

    if (user.verificationTokenExpires.getTime() < Date.now()) {
      throw new BadRequestException('Token de verificacion inválido o inexistente');
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;

    const savedUser = await this.usersRepo.save(user);

    return {
      message: 'Email vrificado correctamente.',
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        isVerified: savedUser.isVerified,
        createdAt: savedUser.createdAt,
      },
    };
  }

  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.usersRepo.findOne({
      where: { email: normalizedEmail },
    });

    // Respuesta generica para no revelar si el email existe o no
    if (!user) {
      return {
        message: 'If the email exists, a reset link was sent',
      };
    }

    const resetPasswordToken = randomUUID();
    const resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;

    await this.usersRepo.save(user);

    const frontendUrl =
      this.cfg.get<string>('FRONTEND_URL') ?? 'http://localhost:4200';

    const resetLink = `${frontendUrl}/reset-password?token=${resetPasswordToken}`;

    const fromEmail =
      this.cfg.get<string>('MAIL_FROM') ?? 'onboarding@resend.dev';

    this.resend.emails
      .send({
        from: fromEmail,
        to: user.email,
        subject: 'Recuperar contraseña',
        html: `
          <h1>Recuperar contraseña</h1>
          <p>Has solicitado restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <p><a href="${resetLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a></p>
          <p>Si el botón no funciona, copia y pega este enlace:</p>
          <p>${resetLink}</p>
          <p>Este enlace expira en 1 hora.</p>
        `,
      })
      .catch((err) => {
        console.error('Error enviando email de recuperacion:', err);
      });

    return {
      message: 'Si el email existe, recibirás un link',
    };
  }

  async resetPassword(token: string, password: string) {
    const user = await this.usersRepo.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user || !user.resetPasswordExpires) {
      throw new BadRequestException('Token inválido o expirado');
    }

    if (user.resetPasswordExpires.getTime() < Date.now()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const rounds = Number(this.cfg.get<string>('BCRYPT_COST') ?? '12');
    user.passwordHash = await bcrypt.hash(password, rounds);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.usersRepo.save(user);

    return {
      message: 'Contraseña actualizada',
    };
  }


  async resendVerification(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (user.isVerified) {
      return {
        message: 'El correo ya está verificado.',
      };
    }

    const verificationToken = randomUUID();
    const verificationTokenExpires = new Date(
      Date.now() + 1000 * 60 * 60 * 24,
    );

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;

    await this.usersRepo.save(user);

    const frontendUrl =
      this.cfg.get<string>('FRONTEND_URL') ?? 'http://localhost:4200';

    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const fromEmail =
      this.cfg.get<string>('MAIL_FROM') ?? 'onboarding@resend.dev';

    this.resend.emails
      .send({
        from: fromEmail,
        to: user.email,
        subject: 'Reenvío de verificación de email',
        html: `
          <h1>Verificá tu correo electrónico</h1>
          <p>Solicitaste un nuevo enlace de verificación.</p>
          <p><a href="${verificationLink}">Verificar email</a></p>
          <p>${verificationLink}</p>
        `,
      })
      .catch((err) => {
        console.error('Error reenviando email con Resend:', err);
      });

    return {
      message: 'Email reenviado',
    };
  }
}