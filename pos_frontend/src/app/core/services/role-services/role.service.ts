import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Role } from '../../interfaces/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/roles`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/get`, { headers: this.getHeaders() })
  }

  getRoleById(id: number): Observable<Role> {
    console.log(' Fetching Role by ID:', id);
    return this.http.get<Role>(`${this.apiUrl}/get/${id}`, { headers: this.getHeaders() })
  }

  createRole(role: { name: string }): Observable<Role> {
    console.log(' Creating Role with data:', role);
    return this.http.post<Role>(`${this.apiUrl}/create`, role, { headers: this.getHeaders() })
  }

updateRole(id: number, data: { name: string; permissionIds?: number[] }): Observable<Role> {
  console.log(`Updating Role #${id} with data:`, data);
  return this.http.put<Role>(`${this.apiUrl}/update/${id}`, data, {
    headers: this.getHeaders(),
  })
}


  deleteRole(id: number): Observable<void> {
    console.log(` Deleting Role #${id}...`);
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() })
  }

  assignPermissionToRole(data: { roleId: number; permissionId: number }): Observable<any> {
    console.log('Assigning Permission to Role:', data);
    return this.http.post(`${environment.apiUrl}/role-permissions`, data, {
      headers: this.getHeaders(),
    })
  }
}
