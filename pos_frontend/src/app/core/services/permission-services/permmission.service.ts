import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permission } from '../../interfaces/permission';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/permissions`; // ✅ match backend route

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Get all permissions
  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/get`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get single permission by ID
  getPermissionById(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.apiUrl}/get/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

createPermission(permission: Permission): Observable<Permission> {
  console.log('🟢 Sending to Backend (POST):', permission); // 👈 Logs data before API call
  return this.http.post<Permission>(`${this.apiUrl}/create`, permission, {
    headers: this.getAuthHeaders()
  });
}


  // ✅ Update permission
  updatePermission(id: number, permission: Permission): Observable<Permission> {
    console.log('🟡 Updating Permission:', permission);
    return this.http.put<Permission>(`${this.apiUrl}/update/${id}`, permission, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Delete permission
  deletePermission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Get all resources (optional extra API)
  getAllResources(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resources`, {
      headers: this.getAuthHeaders()
    });
  }
}
