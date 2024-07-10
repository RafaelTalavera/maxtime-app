import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth-service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    FormsModule,
  
]
})
export class LoginComponent implements OnInit {
  jwt_token: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.jwt_token = localStorage.getItem('jwt_token');
    if (this.jwt_token) {
      this.router.navigate(['/menu']);
    } else {
      console.log('No se encontró ningún token JWT en el almacenamiento local.');
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.authService.login(form.value.username, form.value.password)
        .subscribe({
          next: (data: any) => {
            localStorage.setItem('jwt_token', data.jwt);
            Swal.fire({
              icon: 'success',
              title: 'Inicio de sesión exitoso',
              text: 'Bienvenido de nuevo!',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false
            });
            this.router.navigate(['/menu']);
          },
          error: (error) => {
            console.error('Error al iniciar sesión:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error al iniciar sesión',
              text: 'Nombre de usuario o contraseña incorrectos. Por favor, inténtelo de nuevo.',
              showConfirmButton: true
            });
          }
        });
    } else {
      console.error('Formulario no es válido');
      Swal.fire({
        icon: 'warning',
        title: 'Formulario no válido',
        text: 'Por favor, complete todos los campos correctamente.',
        showConfirmButton: true
      });
    }
  }
}
