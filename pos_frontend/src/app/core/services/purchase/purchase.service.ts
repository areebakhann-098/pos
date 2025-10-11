import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = `${environment.apiUrl}/purchase`;
    private apiUrlsearch = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // ✅ Create a new purchase
  createPurchase(purchaseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, purchaseData);
  }

  // ✅ Get all purchases
  getPurchases(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get`);
  }

  // ✅ Get a purchase by ID
  getPurchaseById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_by_id/${id}`);
  }

  // ✅ Update purchase
  updatePurchase(id: number, purchaseData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, purchaseData);
  }

  // ✅ Delete purchase
  deletePurchase(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
    // ✅ Search products by name
  searchProducts(query: string): Observable<any> {
    const params = new HttpParams().set('q', query);
    return this.http.get(`${this.apiUrlsearch}/search-products`, { params });
  }

}
