import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailPage implements OnInit {
  loading = signal(true);
  success = signal(false);
  message = signal('Verificando email...');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private toast: ToastService,
  ) {}

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.loading.set(false);
      this.success.set(false);
      this.message.set('Token de verificación inválido o inexistente.');
      return;
    }

    try {
      await firstValueFrom(this.auth.verifyEmail(token));

      this.loading.set(false);
      this.success.set(true);
      this.toast.success('Email verificado correctamente');

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2500);
    } catch (err: any) {
      this.loading.set(false);
      this.success.set(false);
      const errorMsg = err.error?.message || 'Token inválido o expirado';
      this.message.set(errorMsg);
      this.toast.error(errorMsg);
    }
  }
}