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

  // ✅ Get All Roles
  getAllRoles(): Observable<Role[]> {
    console.log('📡 Fetching all roles...');
    return this.http.get<Role[]>(`${this.apiUrl}/get`, { headers: this.getHeaders() }).pipe(
      tap({
        next: (res) => console.log('✅ All Roles Response:', res),
        error: (err) => console.error('❌ Failed to fetch roles:', err),
      })
    );
  }

  // ✅ Get Role by ID
  getRoleById(id: number): Observable<Role> {
    console.log('📡 Fetching Role by ID:', id);
    return this.http.get<Role>(`${this.apiUrl}/get/${id}`, { headers: this.getHeaders() }).pipe(
      tap({
        next: (res) => console.log(`✅ Role #${id} Response:`, res),
        error: (err) => console.error(`❌ Failed to fetch role #${id}:`, err),
      })
    );
  }

  // ✅ Create Role
  createRole(role: { name: string }): Observable<Role> {
    console.log('🟢 Creating Role with data:', role);
    return this.http.post<Role>(`${this.apiUrl}/create`, role, { headers: this.getHeaders() }).pipe(
      tap({
        next: (res) => console.log('✅ Role Created Successfully:', res),
        error: (err) => console.error('❌ Failed to create role:', err),
      })
    );
  }

updateRole(id: number, data: { name: string; permissionIds?: number[] }): Observable<Role> {
  console.log(`🟡 Updating Role #${id} with data:`, data);
  return this.http.put<Role>(`${this.apiUrl}/update/${id}`, data, {
    headers: this.getHeaders(),
  }).pipe(
    tap({
      next: (res) => console.log(`✅ Role #${id} Updated Successfully:`, res),
      error: (err) => console.error(`❌ Failed to update role #${id}:`, err),
    })
  );
}


  // ✅ Delete Role
  deleteRole(id: number): Observable<void> {
    console.log(`🔴 Deleting Role #${id}...`);
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() }).pipe(
      tap({
        next: () => console.log(`✅ Role #${id} Deleted Successfully`),
        error: (err) => console.error(`❌ Failed to delete role #${id}:`, err),
      })
    );
  }

  // ✅ Assign Permission to Role
  assignPermissionToRole(data: { roleId: number; permissionId: number }): Observable<any> {
    console.log('🔗 Assigning Permission to Role:', data);
    return this.http.post(`${environment.apiUrl}/role-permissions`, data, {
      headers: this.getHeaders(),
    }).pipe(
      tap({
        next: (res) => console.log('✅ Permission Assigned Successfully:', res),
        error: (err) => console.error('❌ Failed to assign permission:', err),
      })
    );
  }
}
