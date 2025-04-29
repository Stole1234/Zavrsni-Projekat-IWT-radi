// src/app/reservation/reservation.model.ts

export interface Reservation {
  id?: number;
  userId: number;
  movieId: number;
  movieTitle: string;
  projectionId?: number; 
  date: string;
  time: string;
  reservationDate?: string; 
  price: number;
  status: string;
  rating: null;
}
