import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ResultsComponent } from '../../resultados/componets/upload-results/upload-results.component';


@Component({
  selector: 'app-menu-administrador',
  standalone: true,
  imports: [ResultsComponent],
  templateUrl: './menu-organizador.component.html',
  styleUrl: './menu-organizador.component.css'
})
export class MenuOrganizadorComponent {


  constructor(private router: Router) {}

  
  redirectToControl(): void {
    this.router.navigate(['/control']);
  }

  redirectToCargarCarreraOrganizador(): void {
    this.router.navigate(['/carrera-organizador']);
  }

  redirectToListaCarreras(): void {
    this.router.navigate(['/listado-carreras']);
  }



}
