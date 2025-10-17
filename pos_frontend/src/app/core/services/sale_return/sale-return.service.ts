import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SaleReturnService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // ✅ Create Sale Return
  createSaleReturn(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sale-return/create`, payload);
  }

  // ✅ Get All Sale Returns
  getAllSaleReturns(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sale-return/get`);
  }
}
