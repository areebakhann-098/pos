import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SaleReturnService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // 🔹 Helper method to include JWT in request headers
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // 🔑 Get JWT token from localStorage
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // ✅ Create Sale Return
  createSaleReturn(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sale-return/create`, payload, this.getAuthHeaders());
  }

  // ✅ Get All Sale Returns
  getAllSaleReturns(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sale-return/get`, this.getAuthHeaders());
  }
}
