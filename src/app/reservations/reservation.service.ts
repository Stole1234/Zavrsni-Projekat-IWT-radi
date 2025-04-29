import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from './reservation.model';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:3000/api/reservations';

  constructor(private http: HttpClient) {}

  getReservations(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/${userId}`);
  }

  createReservation(reservation: Reservation): Observable<any> {
    return this.http.post<any>(this.apiUrl, reservation);
  }

  removeReservation(userId: number, movieId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}/${movieId}`);
  }

  clearReservations(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }

  checkExistingReservation(userId: number, movieId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check?userId=${userId}&movieId=${movieId}`);
  }

  reserveProjection(reservation: any, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post('http://localhost:3000/api/reservations', reservation, { headers });
  }
  
  checkReservation(userId: number, movieId: number): Observable<any> {
    return this.http.get<any>(
      `/api/reservations/check?userId=${userId}&movieId=${movieId}`
    );
  }
  
}
