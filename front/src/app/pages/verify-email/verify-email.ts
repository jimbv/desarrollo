import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

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
      await firstValueFrom(this.auth.verifyEmail({ token }));

      this.loading.set(false);
      this.success.set(true);
      this.message.set('Email verificado correctamente. Ya podés iniciar sesión.');

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2500);
    } catch {
      this.loading.set(false);
      this.success.set(false);
      this.message.set('No se pudo verificar el email. El token puede ser inválido o haber sido usado.');
    }
  }
}