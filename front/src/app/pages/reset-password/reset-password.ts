import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordPage {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  token = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';
  loading = signal(false);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
    });
  }

  async submit(): Promise<void> {
    this.error = '';
    this.success = '';

    if (!this.token) {
      this.error = 'Falta el token de recuperación';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'La nueva contraseña debe tener al menos 8 caracteres';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.loading.set(true);
    try {
      await firstValueFrom(this.auth.resetPassword({ token: this.token, password: this.password }));
      this.success = 'Tu contraseña se actualizó correctamente.';
    } catch (err: any) {
      this.error = err.error?.message || 'No pudimos actualizar la contraseña';
    } finally {
      this.loading.set(false);
    }
  }
}