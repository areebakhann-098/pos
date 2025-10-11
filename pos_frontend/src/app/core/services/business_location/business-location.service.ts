import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessLocationService {
  private apiUrl = `${environment.apiUrl}/business-locations`;

  constructor(private http: HttpClient) {}

  // ✅ Create Location
  createLocation(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  // ✅ Get All Locations
  getAllLocations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get`);
  }

  // ✅ Get Location by ID
  getLocationById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // ✅ Update Location
  updateLocation(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // ✅ Delete Location
  deleteLocation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
