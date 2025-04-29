import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = 'http://localhost:3000/movies';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMovieById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  searchMovies(term: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search/${term}`);
  }
}
