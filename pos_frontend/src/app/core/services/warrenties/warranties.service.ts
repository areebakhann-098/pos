import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class WarrantiesService {
  private apiUrl = `${environment.apiUrl}/warranties`;

  constructor(private http: HttpClient) {}
createWarranty(data: any): Observable<any> {
  console.log('Sending warranty data:', data);
  return this.http.post(`${this.apiUrl}/create`, data);
}

  getWarranties(): Observable<any> { // <-- return type fixed
    return this.http.get<any>(this.apiUrl);
  }

  getWarrantyById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updateWarranty(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteWarranty(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
