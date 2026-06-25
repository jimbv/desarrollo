import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  notifications = signal<ToastMessage[]>([]);
  private nextId = 0;

  success(message: string): void {
    this.add('success', message);
  }

  error(message: string): void {
    this.add('error', message);
  }

  info(message: string): void {
    this.add('info', message);
  }

  remove(id: number): void {
    this.notifications.update((current) => current.filter((toast) => toast.id !== id));
  }

  private add(type: ToastType, message: string): void {
    const id = this.nextId++;
    const toast: ToastMessage = { id, type, message };
    this.notifications.update((current) => [...current, toast]);
    setTimeout(() => this.remove(id), 4000);
  }
}
