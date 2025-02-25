import { Component, OnInit } from '@angular/core';
import { PortadasService } from './service/portadas-services';
import { Portada } from './models/portada';
import { LoadingService } from '../servicios/loading.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portadas',
  standalone: true,
  templateUrl: './portadas.component.html',
  styleUrls: ['./portadas.component.css'],
  imports: [CommonModule]
})
export class PortadasComponent implements OnInit {

  activePortadas: Portada[] = [];

  constructor(
    private portadasService: PortadasService,
    public loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadingService.startIconChange();
    this.portadasService.getActivePortadas().subscribe({
      next: portadas => {
        this.activePortadas = portadas;
        this.loadingService.stopIconChange();
      },
      error: err => {
        console.error(err);
        this.loadingService.stopIconChange();
      }
    });
  }

  ingresarEvento(portada: Portada): void {
    // Navega a PublicacionCarreraComponent pasando el id de la portada
    this.router.navigate(['/publicacion-carreras'], { queryParams: { portadaId: portada.id } });
  }

  isVideo(media: string): boolean {
    return media?.toLowerCase().endsWith('.mp4');
  }
}
