import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth-service';
import { Router } from '@angular/router';

import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule],

})
export class LoginComponent implements OnInit {
  jwt_token!: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Verificar si ya hay un token JWT en el almacenamiento local
    const jwt_token = localStorage.getItem('jwt_token');
    console.log('Token JWT encontrado en el almacenamiento local:', jwt_token);
    if (jwt_token) {
      console.log('Redirigiendo al usuario a la página de inicio...');
      // Si hay un token JWT, redirigir al usuario a la página de inicio
      this.router.navigate(['/menu']);
    } else {
      console.log('No se encontró ningún token JWT en el almacenamiento local.');
    }
  }

  onSubmit(form: NgForm) {
    this.authService.login(form.value.username, form.value.password)
      .subscribe((data: any) => {
        localStorage.setItem('jwt_token', data.jwt);
        this.router.navigate(['/menu']);
      }, error => {
        console.error('Error al iniciar sesión:', error);
      });
  }
}