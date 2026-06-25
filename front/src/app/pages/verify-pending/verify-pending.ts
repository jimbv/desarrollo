import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-pending',
  templateUrl: './verify-pending.html',
  styleUrl: './verify-pending.css',
})
export class VerifyPendingPage implements OnInit {
  email = '';
  userId = '';
  loading = signal(false);
  message = signal('Te enviamos un mail de verificación');

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';
    this.userId = this.route.snapshot.queryParamMap.get('userId') ?? '';
    if (this.email) {
      this.message.set(`Revisa tu email ${this.email}`);
    }
  }

  async onResendEmail(): Promise<void> {
    if (!this.userId) {
      this.message.set('No se encontró el usuario para reenviar el correo. Vuelve a registrarte o inicia sesión.');
      return;
    }

    this.loading.set(true);
    try {
      const response = await firstValueFrom(this.auth.resendVerification({ userId: this.userId }));
      this.toast.success(response.message);
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al reenviar el email de verificación.');
    } finally {
      this.loading.set(false);
    }
  }
}

