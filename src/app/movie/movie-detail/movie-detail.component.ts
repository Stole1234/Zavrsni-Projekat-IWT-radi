import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../movie.service';
import { AuthService } from '../../account and login/auth.service';
import { ReservationService } from '../../reservations/reservation.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie: any;
  showAbout: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private authService: AuthService,
    private reservationService: ReservationService
  ) {}

  ngOnInit() {
    const movieIdString = this.route.snapshot.paramMap.get('id');
    const movieId = movieIdString ? +movieIdString : null;

    if (movieId !== null) {
      this.movieService.getMovieById(movieId).subscribe(
        (movieData) => {
          this.movie = movieData;
        },
        (error) => {
          console.error('Greška pri učitavanju filma:', error);
        }
      );
    } else {
      console.error('Movie ID is null or invalid');
    }
  }

  toggleAbout() {
    this.showAbout = !this.showAbout;
    console.log('Show About:', this.showAbout);
  }

  reserveProjection(projection: any) {
    if (!this.authService.isLoggedIn()) {
      alert('Moraš biti prijavljen da bi rezervisao projekciju!');
      return;
    }
  
    const userId = this.authService.getUserId();
    if (userId === null) {
      alert('Greška: Nije moguće preuzeti ID korisnika.');
      return;
    }
  
    const token = this.authService.getToken();
    if (!token) {
      alert('Greška: Nema tokena.');
      return;
    }
  
    const reservation = {
      id: 0,
      userId: userId,
      movieId: this.movie.id,
      movieTitle: this.movie.title,
      projectionId: projection.id ?? 0,
      reservationDate: new Date().toISOString(),
      date: projection.date,  
      time: projection.time,  
      price: projection.price ,  
      status: 'rezervisana',
      rating: ''
    };
  
    console.log('Rezervacija:', reservation);  // Loguj podatke pre nego što ih pošalješ
    
    this.reservationService.reserveProjection(reservation, token).subscribe(
      () => {
        alert('Projekcija je uspešno rezervisana!');
      },
      (error) => {
        console.error('Greška pri rezervaciji:', error);
        alert('Greška pri rezervaciji.');
      }
    );
  }
  
  
}
