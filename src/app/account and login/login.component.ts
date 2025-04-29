import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(success => {
      if (success) {
        alert('Uspešno ste se prijavili!');
        this.router.navigate(['/']); // ili početna stranica
      } else {
        alert('Pogrešan username ili lozinka!');
      }
    });
  }
  
}
