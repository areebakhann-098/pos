import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private apiUrl = `${environment.apiUrl}/units`;

  constructor(private http: HttpClient) {}

  // 🔐 Helper → Get Authorization headers with JWT
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // or sessionStorage if you use that
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // ➕ Create Unit
  createUnit(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // 📋 Get All Units
  getAllUnits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`, {
      headers: this.getAuthHeaders(),
    });
  }

  // 🔍 Get Unit by ID
  getUnitById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✏️ Update Unit
  updateUnit(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // ❌ Delete Unit
  deleteUnit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
