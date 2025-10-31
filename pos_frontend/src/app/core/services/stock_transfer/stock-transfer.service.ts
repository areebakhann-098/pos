import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class StockTransferService {
  private apiUrl = `${environment.apiUrl}/migrations`; 
  private searchUrl = `${environment.apiUrl}/search-products`;

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

  createStockTransfer(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload, this.getAuthHeaders());
  }

  getStockTransfers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, this.getAuthHeaders());
  }

  getStockTransferById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  updateStockTransfer(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, payload, this.getAuthHeaders());
  }

  deleteStockTransfer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  searchProducts(query: string): Observable<any> {
    return this.http.get(`${this.searchUrl}?q=${query}`, this.getAuthHeaders());
  }
}
