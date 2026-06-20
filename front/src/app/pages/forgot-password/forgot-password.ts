import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordPage {
  private auth = inject(AuthService);

  email = '';
  error = '';
  success = '';
  loading = signal(false);

  async submit(): Promise<void> {
    this.error = '';
    this.success = '';
    this.loading.set(true);

    try {
      await firstValueFrom(this.auth.forgotPassword({ email: this.email }));
      this.success = 'Si el email existe, vas a recibir un enlace para restablecer tu contraseña.';
    } catch (err: any) {
      this.error = err.error?.message || 'No pudimos enviar el enlace';
    } finally {
      this.loading.set(false);
    }
  }
}