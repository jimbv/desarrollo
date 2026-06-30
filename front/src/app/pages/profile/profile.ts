import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  private usersService = inject(UsersService);

  showPasswordForm = signal(false);
  showEmailForm = signal(false);

  currentPasswordForPassword = '';
  newPassword = '';

  currentPasswordForEmail = '';
  newEmail = '';

  passwordMessage = signal('');
  passwordError = signal('');

  emailMessage = signal('');
  emailError = signal('');

  async changePassword(): Promise<void> {
    this.passwordMessage.set('');
    this.passwordError.set('');

    try {
      const res = await firstValueFrom(
        this.usersService.updateMyPassword({
          currentPassword: this.currentPasswordForPassword,
          newPassword: this.newPassword,
        }),
      );

      this.passwordMessage.set(res.message);
      this.currentPasswordForPassword = '';
      this.newPassword = '';
    } catch {
      this.passwordError.set(
        'No se pudo cambiar la contraseña. Verificá la contraseña actual.',
      );
    }
  }

  async changeEmail(): Promise<void> {
    this.emailMessage.set('');
    this.emailError.set('');

    try {
      const res = await firstValueFrom(
        this.usersService.updateMyEmail({
          currentPassword: this.currentPasswordForEmail,
          newEmail: this.newEmail,
        }),
      );

      this.emailMessage.set(res.message);
      this.currentPasswordForEmail = '';
      this.newEmail = '';

      this.auth.user.set(res.user);
    } catch {
      this.emailError.set(
        'No se pudo cambiar el email. Verificá la contraseña actual o si el email ya está en uso.',
      );
    }
  }
}