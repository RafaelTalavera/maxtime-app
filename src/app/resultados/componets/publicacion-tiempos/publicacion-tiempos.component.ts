import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Carrera } from '../../../carrera/models/carrera';
import { CarreasService } from '../../../carrera/services/carreras.service';
import { LoadingService } from '../../../servicios/loading.service';

@Component({
  selector: 'app-publicacion-tiempos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publicacion-tiempos.component.html',
  styleUrls: ['./publicacion-tiempos.component.css'] // Cambiar a 'styleUrls' en plural
})
export class PublicacionTiemposComponent implements OnInit, OnDestroy {

  carreras: Carrera[] = [];

  constructor(
    private service: CarreasService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.startIconChange();
    this.loadCarreras();
  }

  ngOnDestroy(): void {
    this.loadingService.stopIconChange();
  }

  private loadCarreras(): void {
    this.service.findAllAdministrador().subscribe({
      next: (data: Carrera[]) => {
        this.carreras = data.sort((a, b) => {
          const dateA = new Date(this.convertDate(a.fecha));
          const dateB = new Date(this.convertDate(b.fecha));
          return dateA.getTime() - dateB.getTime();
        });
        this.loadingService.stopIconChange(); // Detener el spinner cuando los datos se hayan cargado
      },
      error: (error) => {
        console.error('Error al cargar carreras:', error);
        this.loadingService.stopIconChange(); // Asegurarse de detener el spinner en caso de error
      }
    });
  }
  
  private convertDate(dateString: string): string {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }
  
  verResultado(carreraId: number): void {
    this.router.navigate(['/posiciones', carreraId]);
  }
}
