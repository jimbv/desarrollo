import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordPage {
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  email = '';
  loading = signal(false);

  async submit(): Promise<void> {
    this.loading.set(true);

    try {
      await firstValueFrom(this.auth.forgotPassword(this.email));
      this.toast.success('Si el email existe, recibirás un link');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No pudimos enviar el enlace');
    } finally {
      this.loading.set(false);
    }
  }
}