import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie.service';
import { AuthService } from '../../account and login/auth.service'; 
import { DomSanitizer } from '@angular/platform-browser'; 
import { Router } from '@angular/router'; 
import { ReservationService } from '../../reservations/reservation.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];  
  searchTerm: string = ''; 
  filteredMovies: any[] = [];

  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private sanitizer: DomSanitizer, 
    private router: Router,
    private reservationService: ReservationService
  ) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getMovies().subscribe((data) => { 
      this.movies = data;
      this.filteredMovies = data;
    });
  }

  searchMovies(criteria: any) {
    this.filteredMovies = this.movies.filter(movie => {
      return (
        (!criteria.title || movie.title.toLowerCase().includes(criteria.title.toLowerCase())) &&
        (!criteria.genre || movie.genre === criteria.genre) &&
        (!criteria.releaseYear || movie.releaseDate.startsWith(criteria.releaseYear))
      );
    });
  }

  addMovieToCart(movie: any) {
    if (!this.authService.isLoggedIn()) {
      alert('Moraš biti prijavljen da bi rezervisao film!');
      return;
    }
  
    const userId = this.authService.getUserId();
    if (userId === null) {
      alert('Greška: Nema prijavljenog korisnika!');
      return;
    }
  
    const token = this.authService.getToken(); // Dobijamo token sa AuthService
    if (!token) {
      alert('Greška: Nema validnog tokena!');
      return;
    }
  
    const reservation = {
      userId: userId,
      movieId: movie.id,
      movieTitle: movie.title,
      date: new Date().toISOString().slice(0, 10),
      time: '20:00',
      price: movie.price || 500,
      status: 'rezervisana',
      rating: null
    };
  
    this.reservationService.checkExistingReservation(userId, movie.id).subscribe(
      (exists) => {
        if (!exists) {
          // Prosleđujemo i reservation i token
          this.reservationService.reserveProjection(reservation, token).subscribe(
            () => {
              alert('Film je uspešno rezervisan!');
            },
            (error) => {
              console.error('Greška prilikom rezervacije:', error);
              alert('Došlo je do greške pri rezervaciji.');
            }
          );
        } else {
          alert('Ovaj film je već rezervisan!');
        }
      },
      (error) => {
        console.error('Greška pri proveri rezervacije:', error);
      }
    );
  }
  
  

  viewDetails(movieId: number) {
    this.router.navigate(['/movies', movieId]);
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  watchTrailer(movie: any) {
    if (movie && movie.trailerUrl) {
      const sanitizedUrl = this.sanitizeUrl(movie.trailerUrl);
      window.open(sanitizedUrl as string, '_blank');
    } else {
      alert('Ovaj film nema dostupnog trejlera.');
    }
  }

  viewCart() {
    this.router.navigate(['/reservations']);
  }
}

