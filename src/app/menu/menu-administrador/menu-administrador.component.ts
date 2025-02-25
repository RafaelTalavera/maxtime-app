import { Component } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-menu-administrador',
  standalone: true,
  imports: [],
  templateUrl: './menu-administrador.component.html',
  styleUrl: './menu-administrador.component.css'
})
export class MenuAdministradorComponent {


  constructor(private router: Router) {}

  
  redirectToResultado(): void {
    this.router.navigate(['/carga-resultados']);
  }

  redirectToOrganizadores(): void {
    this.router.navigate(['/organizadores']);
  }

  redirectToListaCarreras(): void {
    this.router.navigate(['/listado-carreras']);
  }

  redirectToListaOrganizadores(): void {
    this.router.navigate(['/list-organizadores']);
  }

}
