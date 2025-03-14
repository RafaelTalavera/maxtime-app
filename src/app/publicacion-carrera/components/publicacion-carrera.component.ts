import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CarreraService } from '../service/carrera-services';
import { Router, ActivatedRoute } from '@angular/router';
import { FormCorredorComponent } from '../../corredor/componente/form-corredor.component';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../servicios/loading.service';
import { Subscription } from 'rxjs';
import { Carrera } from '../models/publicacion-carrera';

@Component({
  selector: 'app-carrera-publicacion',
  standalone: true,
  templateUrl: './publicacion-carrera.component.html',
  styleUrls: ['./publicacion-carrera.component.css'],
  imports: [CommonModule]
})
export class PublicacionCarreraComponent implements OnInit, OnDestroy {
  carreras: Carrera[] = [];
  tipo: string = ''; 
  valor: number = 0; 

  private querySub!: Subscription;

  @ViewChild(FormCorredorComponent) formCorredorComponent!: FormCorredorComponent;

  constructor(
    private carreraService: CarreraService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.startIconChange();
    
    this.querySub = this.activatedRoute.queryParams.subscribe(params => {
      const portadaId = +params['portadaId'] || 0;
      if (portadaId !== 0) {
        this.carreraService.getCarrerasByPortada(portadaId).subscribe({
          next: data => {
            console.log('Datos obtenidos por portada:', data);
            this.carreras = data
              .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()); // 🔹 Orden ascendente
            this.loadingService.stopIconChange();
          },
          error: error => {
            console.error('Error al cargar carreras por portada:', error);
            this.loadingService.stopIconChange();
          }
        });
      } else {
        this.carreraService.getCarreras().subscribe({
          next: data => {
            console.log('Datos obtenidos:', data);
            this.carreras = data
              .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()); // 🔹 Orden ascendente
            this.loadingService.stopIconChange();
          },
          error: error => {
            console.error('Error al cargar carreras:', error);
            this.loadingService.stopIconChange();
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.loadingService.stopIconChange();
    if (this.querySub) {
      this.querySub.unsubscribe();
    }
  }

  inscripcion(carreraId: number, distanciaId: number, tipo: string, valor: number, linkDePago: string): void {
    console.log('Valor enviado a la inscripción:', valor);
  
    this.router.navigate(['/inscripcion'], { 
      queryParams: { 
        carreraId: carreraId,
        distanciaId: distanciaId,
        tipo: tipo,
        valor: valor,
        linkDePago: linkDePago
      }
    });
  }
  

  formatHora(horario: string): string {
    const hora = parseInt(horario.substring(0, 2), 10);
    const minutos = parseInt(horario.substring(3, 5), 10);
    return hora >= 12 ? `${hora - 12}:${minutos} pm` : `${hora}:${minutos} am`;
  }

  isVideo(url: string): boolean {
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg');
  }

  abrirWhatsApp(contacto: string): void {
    const telefono = contacto.replace(/\D/g, '');
    if (telefono) {
      window.open(`https://wa.me/${telefono}`, '_blank');
    } else {
      console.error('Número de contacto inválido.');
    }
  }
}
