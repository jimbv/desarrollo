import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordPage {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  token = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
    });
  }

  async submit(): Promise<void> {
    if (!this.token) {
      this.toast.error('Falta el token de recuperación');
      return;
    }

    if (this.password.length < 8) {
      this.toast.error('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);
    try {
      await firstValueFrom(this.auth.resetPassword({ token: this.token, password: this.password }));
      this.toast.success('Contraseña actualizada');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No pudimos actualizar la contraseña');
    } finally {
      this.loading.set(false);
    }
  }
}