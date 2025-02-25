import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  imports: [],
})
export class MenuComponent {

  constructor(private router: Router) {}


  redirectToMenuOrganizador(): void {
    this.router.navigate(['/menu-organizador']);
  }

  redirectToMenuAdministrador(): void {
    this.router.navigate(['/menu-administrador']);
  }

}
