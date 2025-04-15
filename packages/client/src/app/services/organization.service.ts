import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Organization {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  warehouses_count?: number;
  members_count?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = `${environment.apiUrl}/api/organizations`;

  constructor(private http: HttpClient) {}

  getUserOrganization(): Observable<Organization | null> {
    return this.http.get<Organization | null>(`${this.apiUrl}/user`);
  }

  createOrganization(name: string, description?: string): Observable<Organization> {
    return this.http.post<Organization>(this.apiUrl, { name, description });
  }
} 