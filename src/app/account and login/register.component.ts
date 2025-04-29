import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  fullName: string = '';
  phoneNumber: string = '';

  constructor(private authService: AuthService) {}

  // Poziv registra
  onSubmit(): void {
    const userData = { username: this.username, password: this.password, email: this.email,
      fullName: this.fullName,
      phoneNumber: this.phoneNumber
     };
    this.authService.register(userData).subscribe(
      success => {
        if (success) {
          alert('Registracija uspešna!');
        } else {
          alert('Došlo je do greške.');
        }
      }
    );
  }
}
