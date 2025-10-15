import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private baseUrl = `${environment.apiUrl}/sale`;

  constructor(private http: HttpClient) {}

  // ➕ Create Sale
  createSale(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  // 📋 Get All Sales
  getAllSales(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get`);
  }

  // 🔍 Get Sale by ID
  getSaleById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // ✏️ Update Sale
  updateSale(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, data);
  }

  // ❌ Delete Sale
  deleteSale(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delet/${id}`);
  }
}
