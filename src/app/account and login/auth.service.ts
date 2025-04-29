import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<{ token: string, user: any }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map(response => {
          console.log('Odgovor sa servera:', response);  // Dodaj log za odgovor
          if (response.token && response.user) {
            localStorage.setItem('authToken', response.token);  // Koristi 'authToken'
            localStorage.setItem('user', JSON.stringify(response.user));
            return true;
          }
          return false;
        }),
        catchError(error => {
          console.error('Greška pri loginu:', error);  // Loguj grešku
          return of(false);
        })
      );
  }
  
  register(userData: any): Observable<boolean> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, userData)
      .pipe(
        map(response => {
          console.log(response.message);
          return true;
        }),
        catchError(() => of(false))
      );
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');  // Vraćaj token pod 'authToken' ključem
  }

  getUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user ? user.id : null;
  }
  
  getToken(): string | null {
    const token = localStorage.getItem('authToken');
    console.log('Token:', token);  
    return token;
  }
  
}
