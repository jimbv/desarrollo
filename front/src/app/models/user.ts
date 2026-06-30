export interface SafeUser {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export type UserRole = 'user' | 'admin';

export interface UpdateUserRoleDto {
  role: UserRole;
}

export interface UpdateMyPasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateMyEmailDto {
  newEmail: string;
  password: string;
}

export interface MessageResponse {
  message: string;
}