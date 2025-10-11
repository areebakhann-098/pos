// src/app/core/services/brand/brand.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private apiUrl = `${environment.apiUrl}/brand`; // ✅ Use env base URL

  constructor(private http: HttpClient) {}

  // ➕ Create Brand
  createBrand(brandData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, brandData);
  }

  // 📋 Get All Brands
  getAllBrands(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`);
  }

  // 🔍 Get Brand by ID
  getBrandById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/list/${id}`);
  }

  // ✏️ Update Brand
  updateBrand(id: string, brandData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, brandData);
  }

  // 🗑️ Delete Brand
  deleteBrand(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
