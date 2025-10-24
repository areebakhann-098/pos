import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessLocationService {
  private apiUrl = `${environment.apiUrl}/business-locations`;

  constructor(private http: HttpClient) {}

  // 🔹 Helper method to add JWT token to headers
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // ✅ Create Location
  createLocation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data, this.getAuthHeaders());
  }

  // ✅ Get All Locations
  getAllLocations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get`, this.getAuthHeaders());
  }

  // ✅ Get Location by ID
  getLocationById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // ✅ Update Location
  updateLocation(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  // ✅ Delete Location
  deleteLocation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
