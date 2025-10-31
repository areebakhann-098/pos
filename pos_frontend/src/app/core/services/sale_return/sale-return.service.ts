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

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); 
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  createSaleReturn(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sale-return/create`, payload, this.getAuthHeaders());
  }

  getAllSaleReturns(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sale-return/get`, this.getAuthHeaders());
  }
}
