// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MovieListComponent } from './movie/movie-list/movie-list.component';
import { MovieDetailComponent } from './movie/movie-detail/movie-detail.component';
import { AboutComponent } from './about/about.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './account and login/register.component';
import { LoginComponent } from './account and login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchBarComponent } from './search/search-bar.component'; 
import { HttpClientModule } from '@angular/common/http';
import { ReservationComponent } from './reservations/reservation.component';
@NgModule({
  declarations: [
    AppComponent,
    MovieListComponent,
    MovieDetailComponent,
    AboutComponent,
    RegisterComponent,
    LoginComponent,
    SearchBarComponent,
    ReservationComponent 
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatCardModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  
})
export class AppModule { }