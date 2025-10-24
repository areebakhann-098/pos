import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class WarrantiesService {
  private apiUrl = `${environment.apiUrl}/warranties`;

  constructor(private http: HttpClient) {}

  // 🔐 Method to attach JWT token to every request
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // 👈 Get token from localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ➕ Create Warranty
  createWarranty(data: any): Observable<any> {
    console.log('📦 Sending warranty data:', data);
    return this.http.post(`${this.apiUrl}/create`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // 📋 Get All Warranties
  getWarranties(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`, {
      headers: this.getAuthHeaders(),
    });
  }

  // 🔍 Get Warranty by ID
  getWarrantyById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/detail/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✏️ Update Warranty
  updateWarranty(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // ❌ Delete Warranty
  deleteWarranty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
