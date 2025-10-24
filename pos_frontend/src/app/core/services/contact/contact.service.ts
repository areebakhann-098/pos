import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contacts`;

  constructor(private http: HttpClient) {}

  // 🔹 Helper method to attach JWT token
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token || ''}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // ✅ Add new contact
  createContact(contactData: any): Observable<any> {
    return this.http.post(this.apiUrl, contactData, this.getAuthHeaders());
  }

  // ✅ Get all contacts
  getContacts(): Observable<any> {
    return this.http.get(this.apiUrl, this.getAuthHeaders());
  }

  // ✅ Get contact by ID
  getContactById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }

  // ✅ Update contact
  updateContact(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, this.getAuthHeaders());
  }

  // ✅ Delete contact
  deleteContact(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.getAuthHeaders());
  }
}
