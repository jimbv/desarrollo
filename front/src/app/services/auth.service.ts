import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, ForgotPasswordDto, LoginDto, RegisterDto, RegisterResponse, ResendVerificationDto, ResendVerificationResponse, ResetPasswordDto, VerifyEmailDto, VerifyEmailResponse } from '../models/auth';
import { SafeUser } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'access_token';

  user = signal<SafeUser | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const token = this.getToken();
    if (token) {
      this.me().subscribe();
    }
  }

  register(dto: RegisterDto): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.api}/register`, dto);
  } // Reemplazo de AuthResponse por RegisterResponse para que coincida con la respuesta del backend

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, dto);
  }

  setAuth(res: AuthResponse): void {
    this.handleAuth(res);
  }

  forgotPassword(dto: ForgotPasswordDto): Observable<void> {
    return this.http.post<void>(`${this.api}/forgot-password`, dto);
  }

  resetPassword(dto: ResetPasswordDto): Observable<void> {
    return this.http.post<void>(`${this.api}/reset-password`, dto);
  }

  verifyEmail(dto: VerifyEmailDto): Observable<VerifyEmailResponse> {
    return this.http.post<VerifyEmailResponse>(`${this.api}/verify-email`, dto);
  }

  resendVerification(dto: ResendVerificationDto): Observable<ResendVerificationResponse> {
    return this.http.post<ResendVerificationResponse>(`${this.api}/resend-verification`, dto);
  }

  me(): Observable<SafeUser> {
    return this.http.get<SafeUser>(`${this.api}/me`).pipe(
      tap((user) => this.user.set(user)),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.user()?.role === 'admin';
  }

  private handleAuth(res: AuthResponse): void {
    localStorage.setItem(this.tokenKey, res.access_token);
    this.user.set(res.user);
  }
}
