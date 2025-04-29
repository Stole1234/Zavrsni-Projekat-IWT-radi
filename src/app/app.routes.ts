import { Routes } from '@angular/router';
import { MovieListComponent } from './movie/movie-list/movie-list.component';
import { AboutComponent } from './about/about.component';
import { MovieDetailComponent } from './movie/movie-detail/movie-detail.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/movies', pathMatch: 'full' },
  { path: 'movies', component: MovieListComponent }, 
  { path: 'movies/:id', component: MovieDetailComponent }, 
  { path: 'about', component: AboutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

