import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TaxRateService {
  private baseUrl = `${environment.apiUrl}/tax-rates`;

  constructor(private http: HttpClient) {}

  // 🔹 Helper Method — Attach JWT Token to Headers
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // 🔑 Retrieve JWT token from localStorage
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // ➕ Create Tax Rate
  createTaxRate(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data, this.getAuthHeaders());
  }

  // 📋 Get All Tax Rates
  getAllTaxRates(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get`, this.getAuthHeaders());
  }

  // ✏️ Update Tax Rate
  updateTaxRate(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data, this.getAuthHeaders());
  }

  // ❌ Delete Tax Rate
  deleteTaxRate(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
}
