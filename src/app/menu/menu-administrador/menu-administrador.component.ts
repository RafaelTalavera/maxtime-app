import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResultsComponent } from '../../resultados/componets/upload-results/upload-results.component';


@Component({
  selector: 'app-menu-administrador',
  standalone: true,
  imports: [ResultsComponent],
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



}
