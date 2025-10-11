import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private apiUrl = `${environment.apiUrl}/discounts`;

  constructor(private http: HttpClient) {}

  // ✅ Create a discount
  createDiscount(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  // ✅ Get all discounts
  getDiscounts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/get`);
  }

  // ✅ Get discount by ID
  getDiscountById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`); // ✅ FIXED
  }

  // ✅ Update discount
  updateDiscount(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data); // ✅ FIXED
  }

  // ✅ Delete discount
  deleteDiscount(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}

