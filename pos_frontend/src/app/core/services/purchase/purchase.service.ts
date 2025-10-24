import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = `${environment.apiUrl}/purchase`;
  private apiUrlsearch = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // 🔹 Helper method to attach JWT token
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // 🔑 Get JWT token from localStorage
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // ✅ Create a new purchase
  createPurchase(purchaseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, purchaseData, this.getAuthHeaders());
  }

  // ✅ Get all purchases
  getPurchases(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get`, this.getAuthHeaders());
  }

  // ✅ Get a purchase by ID
  getPurchaseById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_by_id/${id}`, this.getAuthHeaders());
  }

  // ✅ Update purchase
  updatePurchase(id: number, purchaseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, purchaseData, this.getAuthHeaders());
  }

  // ✅ Delete purchase
  deletePurchase(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, this.getAuthHeaders());
  }

  // ✅ Search products by name
  searchProducts(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);
    return this.http.get(`${this.apiUrlsearch}/search-products`, { 
      ...this.getAuthHeaders(),
      params 
    });
  }
}
