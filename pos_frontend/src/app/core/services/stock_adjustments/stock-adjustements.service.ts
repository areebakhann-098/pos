import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class StockAdjustmentsService {
  private apiUrl = `${environment.apiUrl}/stockadjustment`; 

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

  createStockAdjustment(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, payload, this.getAuthHeaders());
  }

  getAllAdjustments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`, this.getAuthHeaders());
  }

  getAdjustmentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${id}`, this.getAuthHeaders());
  }

  updateAdjustment(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, payload, this.getAuthHeaders());
  }

  deleteAdjustment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, this.getAuthHeaders());
  }

  searchProducts(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search-products?q=${query}`, this.getAuthHeaders());
  }
}
