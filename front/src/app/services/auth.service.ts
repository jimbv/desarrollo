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
  }

  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, dto);
  }

  setAuth(res: AuthResponse): void {
    this.handleAuth(res);
  }

  forgotPassword(email: string) {
  return this.http.post<any>(`${this.api}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string) {
  return this.http.post<any>(`${this.api}/reset-password`, { token, password });
  }

  verifyEmail(token: string) {
  return this.http.post<any>(`${this.api}/verify-email`, { token });
  }

  resendVerification(): Observable<any> {
  return this.http.post<any>(`${this.api}/resend-verification`, {});
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
