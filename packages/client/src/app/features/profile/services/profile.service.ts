import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = `${environment.apiUrl}/profile`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  updateUserProfile(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/profile-edit`, formData);
  }
}