import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface OrganizationUser {
  id: number;
  username: string;
  email: string;
  role: 'creator' | 'admin' | 'member';
}

export interface SearchedUser {
  id: number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationUsersService {
  private apiUrl = `${environment.apiUrl}/api/organizations`;

  constructor(private http: HttpClient) {}

  getOrganizationUsers(organizationId: number): Observable<OrganizationUser[]> {
    return this.http.get<OrganizationUser[]>(`${this.apiUrl}/${organizationId}/users`);
  }

  searchUsers(searchTerm: string): Observable<SearchedUser[]> {
    return this.http.get<SearchedUser[]>(`${this.apiUrl}/search`, {
      params: { searchTerm }
    });
  }

  inviteUser(organizationId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${organizationId}/invite`, { userId });
  }

  updateUserRole(organizationId: number, userId: number, newRole: 'admin' | 'member'): Observable<any> {
    return this.http.put(`${this.apiUrl}/${organizationId}/role`, { userId, newRole });
  }

  removeUser(organizationId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${organizationId}/remove`, {
      body: { userId }
    });
  }
} 