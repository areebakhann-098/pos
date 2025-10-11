import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private apiUrl = `${environment.apiUrl}/units`;

  constructor(private http: HttpClient) {}

  // ➕ Create Unit
  createUnit(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data);
  }

  // 📋 Get All Units
  getAllUnits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`);
  }

  // 🔍 Get Unit by ID
  getUnitById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${id}`);
  }

  // ✏️ Update Unit
  updateUnit(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, data);
  }

  // ❌ Delete Unit
  deleteUnit(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
