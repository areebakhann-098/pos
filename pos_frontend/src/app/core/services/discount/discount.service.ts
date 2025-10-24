import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private apiUrl = `${environment.apiUrl}/discounts`;

  constructor(private http: HttpClient) {}

  // 🔹 Helper method to attach JWT token
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // ✅ Create a discount
  createDiscount(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data, this.getAuthHeaders());
  }

  // ✅ Get all discounts
  getDiscounts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get`, this.getAuthHeaders());
  }

  // ✅ Get discount by ID
  getDiscountById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // ✅ Update discount
  updateDiscount(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  // ✅ Delete discount
  deleteDiscount(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, this.getAuthHeaders());
  }
}
