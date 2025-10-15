import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class StockAdjustmentsService {
  private apiUrl = `${environment.apiUrl}/stockadjustment`; // base URL for stock adjustment

  constructor(private http: HttpClient) {}

  // ➝ Create Stock Adjustment
  createStockAdjustment(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, payload);
  }

  // ➝ Get All Adjustments
  getAllAdjustments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`);
  }

  // ➝ Get Adjustment by ID
  getAdjustmentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${id}`);
  }

  // ➝ Update Adjustment
  updateAdjustment(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, payload);
  }

  // ➝ Delete Adjustment
  deleteAdjustment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // ➝ Search Products
  searchProducts(query: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/search-products?q=${query}`);
  }
}
