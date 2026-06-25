import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  email = '';
  password = '';
  loading = signal(false);

  async submit(): Promise<void> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(
        this.auth.login({ email: this.email, password: this.password }),
      );

      if (!response.user.isVerified) {
        this.router.navigate(['/verify-pending'], {
          queryParams: {
            email: response.user.email,
            userId: response.user.id,
          },
        });
        return;
      }

      this.auth.setAuth(response);
      this.router.navigate(['/']);
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al iniciar sesión');
    } finally {
      this.loading.set(false);
    }
  }
}
