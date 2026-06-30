import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  private usersService = inject(UsersService);
  private toast = inject(ToastService);

  showPasswordForm = signal(false);
  showEmailForm = signal(false);

  currentPasswordForPassword = '';
  newPassword = '';

  currentPasswordForEmail = '';
  newEmail = '';

  async changePassword(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.usersService.updateMyPassword({
          currentPassword: this.currentPasswordForPassword,
          newPassword: this.newPassword,
        }),
      );

      this.toast.success(res.message || 'Contraseña actualizada');
      this.currentPasswordForPassword = '';
      this.newPassword = '';
      this.showPasswordForm.set(false);
    } catch (err: any) {
      this.toast.error(
        err.error?.message || 'No se pudo cambiar la contraseña. Verificá la contraseña actual.',
      );
    }
  }

  async changeEmail(): Promise<void> {
    try {
      const dto = {
        password: this.currentPasswordForEmail,
        newEmail: this.newEmail,
      } as any;

      const res = await firstValueFrom(
        this.usersService.updateMyEmail(dto),
      );

      this.toast.success(res.message || 'Email actualizado');
      this.currentPasswordForEmail = '';
      this.newEmail = '';
      this.showEmailForm.set(false);

      if (res.user) {
        this.auth.user.set(res.user);
      }
    } catch (err: any) {
      this.toast.error(
        err.error?.message || 'No se pudo cambiar el email. Verificá la contraseña actual o si el email ya está en uso.',
      );
    }
  }
}