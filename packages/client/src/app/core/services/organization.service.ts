import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from '../models/organization.model';
import { OrganizationUser } from '../models/organization-user.model';
import { UserRole } from '../models/user-role.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = '/api/organizations';

  constructor(private http: HttpClient) {}

  getOrganization(id: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`);
  }

  getOrganizationUsers(organizationId: string): Observable<OrganizationUser[]> {
    return this.http.get<OrganizationUser[]>(`${this.apiUrl}/${organizationId}/users`);
  }

  inviteUser(organizationId: string, nickname: string): Observable<OrganizationUser> {
    return this.http.post<OrganizationUser>(`/api/organizations/${organizationId}/invite`, { nickname });
  }

  promoteUser(organizationId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${organizationId}/users/${userId}/promote`, {});
  }

  demoteUser(organizationId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${organizationId}/users/${userId}/demote`, {});
  }

  updateUserRole(organizationId: string, userId: string, role: UserRole): Observable<OrganizationUser> {
    return this.http.patch<OrganizationUser>(`${this.apiUrl}/${organizationId}/users/${userId}/role`, { role });
  }

  removeUser(organizationId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${organizationId}/users/${userId}`);
  }
} 
 