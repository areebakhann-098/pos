import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private apiUrl = `${environment.apiUrl}/brand`; 

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

  createBrand(brandData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, brandData, this.getAuthHeaders());
  }

  getAllBrands(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`, this.getAuthHeaders());
  }

  getBrandById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${id}`, this.getAuthHeaders());
  }

  updateBrand(id: string, brandData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, brandData, this.getAuthHeaders());
  }

  deleteBrand(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, this.getAuthHeaders());
  }
}
