import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  MessageResponse,
  SafeUser,
  UpdateMyEmailDto,
  UpdateMyPasswordDto,
  UpdateUserRoleDto,
} from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<SafeUser[]> {
    return this.http.get<SafeUser[]>(`${this.api}/users`);
  }

  updateRole(id: string, dto: UpdateUserRoleDto): Observable<SafeUser> {
    return this.http.patch<SafeUser>(`${this.api}/users/${id}/role`, dto);
  }
  updateMyPassword(dto: UpdateMyPasswordDto): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(`${this.api}/users/me/password`, dto);
  }

  updateMyEmail(dto: UpdateMyEmailDto): Observable<{ message: string; user: SafeUser }> {
    return this.http.patch<{ message: string; user: SafeUser }>(
      `${this.api}/users/me/email`,
      dto,
    );
  }
}