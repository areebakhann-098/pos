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

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); 
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  createTaxRate(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data, this.getAuthHeaders());
  }

  getAllTaxRates(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get`, this.getAuthHeaders());
  }

  updateTaxRate(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data, this.getAuthHeaders());
  }

  deleteTaxRate(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }
}
