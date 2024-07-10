import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {

  constructor(private router: Router) {}

  redirectToOrganizadores(): void {
    this.router.navigate(['/organizadores']);
  }

  redirectToControl(): void {
    this.router.navigate(['/control']);
  }

}
