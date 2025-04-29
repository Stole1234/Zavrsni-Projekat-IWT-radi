import { Component, OnInit } from '@angular/core';
import { ReservationService } from './reservation.service';
import { Reservation } from './reservation.model';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  reservations: Reservation[] = [];
  newReservation: Reservation = {
    id: 0,
    userId: 0,
    movieId: 0,
    movieTitle: '',
    reservationDate: '',
    projectionId: 0,
    date: '',
    time: '',
    price: 0,
    status: 'pending',
    rating: null
  };
  

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (userId) {
      this.loadReservations(userId);
    }
  }

  loadReservations(userId: number): void {
    this.reservationService.getReservations(userId).subscribe(data => {
      this.reservations = data;
    });
  }

  makeReservation(): void {
    this.newReservation.userId = Number(localStorage.getItem('userId'));
    this.newReservation.reservationDate = new Date().toISOString();
    this.newReservation.status = 'pending';
  
    this.reservationService.checkReservation(this.newReservation.userId, this.newReservation.movieId)
      .subscribe((res: any) => {
        if (res.exists) {
          alert('Već ste rezervisali ovu projekciju.');
        } else {
          this.reservationService.createReservation(this.newReservation).subscribe(() => {
            this.loadReservations(this.newReservation.userId);
          });
        }
      });
  }
  
  

  removeReservation(movieId: number): void {
    const userId = Number(localStorage.getItem('userId'));
    this.reservationService.removeReservation(userId, movieId).subscribe(() => {
      this.loadReservations(userId);
    });
  }
  clearAllReservations(): void {
    const userId = Number(localStorage.getItem('userId'));
    this.reservationService.clearReservations(userId).subscribe(() => {
      this.loadReservations(userId);
    });
  }
  
}
