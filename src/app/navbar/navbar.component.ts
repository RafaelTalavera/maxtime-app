import { Component, OnInit, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../login/auth-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap'; // Importa NgbCollapse para controlar el menú

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbCollapse // Agrega NgbCollapse a las importaciones
  ]
})
export class NavbarComponent implements OnInit {
  jwt_token: string | null = null;
  isAdmin: boolean = false;
  isNavbarCollapsed = true; // Agrega una propiedad para manejar el estado del menú

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.jwt_token = localStorage.getItem('jwtToken');
      if (this.jwt_token) {
        const decodedToken: any = this.jwt_decode(this.jwt_token);
        this.isAdmin = decodedToken.role === 'ADMIN';
      }
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar-toggler') && !target.closest('.navbar-collapse')) {
      this.isNavbarCollapsed = true; // Cierra el menú si el clic es fuera de él
    }
  }

  jwt_decode(token: string): any {
    return JSON.parse(atob(token.split('.')[1]));
  }

  logout(): void {
    this.authService.logout();
    this.jwt_token = null;
    this.isAdmin = false;
    this.router.navigate(['/home']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToMenu(): void {
    this.router.navigate(['/menu']);
  }

  goToPublicacionCarrera(): void {
    this.router.navigate(['/portadas-carreras']);
  }

  goToNosotros(): void {
    this.router.navigate(['/nosotros'])
  }

  goToHome(): void {
    this.router.navigate(['/home'])
  }

  goTotiempos(): void {
    this.router.navigate(['/publicacion-tiempos'])
  }
  
  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
