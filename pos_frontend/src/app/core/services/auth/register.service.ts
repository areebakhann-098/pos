import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = `${environment.apiUrl}/auth/register`;
    private login = `${environment.apiUrl}/auth/login`;


  constructor(private http: HttpClient) {}

  registerUser(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
   loginUser(data: any): Observable<any> {
    return this.http.post(this.login, data);
  }
}
