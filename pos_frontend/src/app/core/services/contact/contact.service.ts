import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contacts`;

  constructor(private http: HttpClient) {}

  // ✅ Add new contact
  createContact(contactData: any): Observable<any> {
    return this.http.post(this.apiUrl, contactData);
  }

  // ✅ Get all contacts
  getContacts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // ✅ Get contact by ID
  getContactById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // ✅ Update contact
  updateContact(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // ✅ Delete contact
  deleteContact(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
