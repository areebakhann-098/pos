import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private apiUrl = `${environment.apiUrl}/units`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  createUnit(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllUnits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUnitById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateUnit(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteUnit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
