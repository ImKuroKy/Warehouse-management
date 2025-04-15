import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserRole } from '../models/user-role.model';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    // Получаем данные пользователя из списка пользователей организации
    // В реальном приложении здесь должен быть токен или другой способ идентификации
    return this.http.get<User[]>(`${this.apiUrl}/organizations/current/users`).pipe(
      map(users => users[0]) // Берем первого пользователя из списка
    );
  }

  getCurrentUserRole(organizationId: string): Observable<UserRole> {
    return this.http.get<UserRole>(`${this.apiUrl}/organizations/${organizationId}/users/me`);
  }
} 
 