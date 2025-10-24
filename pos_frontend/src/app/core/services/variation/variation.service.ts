import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class VariationService {
  private baseUrl = `${environment.apiUrl}/variation`;

  constructor(private http: HttpClient) {}

  // 🔐 Get JWT Token Headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // 👈 token saved after login
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // 🔹 Create Variation
  createVariation(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // 🔹 Get All Variations
  getAllVariations(): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.baseUrl}/list`, {
      headers: this.getAuthHeaders(),
    });
  }

  // 🔹 Get Variation by ID
  getVariationById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/detail/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // 🔹 Update Variation
  updateVariation(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // 🔹 Delete Variation
  deleteVariation(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Add values to existing variation
  addValues(id: number, data: { values: string[] }): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/add-values`, data, {
      headers: this.getAuthHeaders(),
    });
  }
}
