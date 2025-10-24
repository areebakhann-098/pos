import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private apiUrl = `${environment.apiUrl}/brand`; // ✅ Use env base URL

  constructor(private http: HttpClient) {}

  // 🔹 Helper method to add JWT token to headers
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // ➕ Create Brand
  createBrand(brandData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, brandData, this.getAuthHeaders());
  }

  // 📋 Get All Brands
  getAllBrands(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`, this.getAuthHeaders());
  }

  // 🔍 Get Brand by ID
  getBrandById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${id}`, this.getAuthHeaders());
  }

  // ✏️ Update Brand
  updateBrand(id: string, brandData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, brandData, this.getAuthHeaders());
  }

  // 🗑️ Delete Brand
  deleteBrand(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, this.getAuthHeaders());
  }
}
