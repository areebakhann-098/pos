import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TaxRateService {
  private baseUrl = `${environment.apiUrl}/tax-rates`;

  constructor(private http: HttpClient) {}

  // ➕ Create Tax Rate
  createTaxRate(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  // 📋 Get All Tax Rates
  getAllTaxRates(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get`);
  }

  // ✏️ Update Tax Rate
  updateTaxRate(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // ❌ Delete Tax Rate
  deleteTaxRate(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
