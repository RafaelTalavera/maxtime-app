// navbar.component.ts
import { Component, OnInit, Inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../login/auth-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  
  ],
 
})
export class NavbarComponent implements OnInit {
  jwt_token: string | null = null;
  isAdmin: boolean = false;

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
    this.router.navigate(['/publicacion-carreras']);
  }

  goToNosotros(): void {
    this.router.navigate(['/nosotros'])
  }

  goToHome(): void {
    this.router.navigate(['/home'])
  }
}
