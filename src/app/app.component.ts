import { Component } from '@angular/core';
import { AuthService } from './account and login/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
    alert('Uspešno ste se odjavili!');
  }
}
