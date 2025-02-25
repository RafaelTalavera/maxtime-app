import { Component } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-menu-administrador',
  standalone: true,
  imports: [],
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

  redirectToCargarPortada(): void {
    this.router.navigate(['/portada']);
  }

  redirectToListaCarreras(): void {
    this.router.navigate(['/listado-carreras']);
  }

  redirectToListaDistancia(): void {
    this.router.navigate(['/lista-carrera-organizador']);
  }
  
redirectToPause(): void {
  this.router.navigate(['/lista-carrera-pausa'])
}

redirectToStop(): void {
  this.router.navigate(['/lista-carrera-stop'])
}

redirectDescuentos():void {
  this.router.navigate(['/lista-carreras-descuentos'])
}

}
