import { Component, OnInit } from '@angular/core';
import { Distancia } from '../../models/distancia';
import { DistanciaService } from '../../services/distancia.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormDistanciaComponent } from '../form-distancia/form-distancia.component';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../servicios/loading.service';
 // Asegúrate de importar el servicio

@Component({
  selector: 'app-distancias',
  standalone: true,
  templateUrl: './distancias.component.html',
  styleUrls: ['./distancias.component.css'],
  imports: [FormDistanciaComponent, CommonModule]
})
export class DistanciasComponent implements OnInit {
  carreraId!: number;
  organizadorId!: number;
  distancias: Distancia[] = [];
  distanciaSelected: Distancia = new Distancia();

  constructor(
    private service: DistanciaService, 
    private route: ActivatedRoute,
    public loadingService: LoadingService // Inyectar el servicio de carga
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.carreraId = +params['carreraId'];
      this.organizadorId = +params['organizadorId'];
      this.distanciaSelected.organizadorId = this.organizadorId;
      this.distanciaSelected.carreraId = this.carreraId;
    });

    this.loadingService.startIconChange(); // Iniciar el spinner

    this.service.findAll(this.organizadorId, this.carreraId).subscribe(
      distancias => {
        this.distancias = distancias.map(distancia => new Distancia(distancia));
        this.loadingService.stopIconChange(); // Detener el spinner al completar la carga
      },
      error => {
        console.error('Error al cargar distancias:', error);
        this.loadingService.stopIconChange(); // Detener el spinner incluso si hay un error
      }
    );
  }

  addDistancia(distancia: Distancia) {
    if (distancia.id > 0) {
      this.service.updateDistancia(distancia).subscribe(distanciaUpdated => {
        this.distancias = this.distancias.map(dist =>
          dist.id === distancia.id ? distanciaUpdated : dist
        );
        Swal.fire({
          icon: 'success',
          title: 'Distancia Actualizada',
          text: 'La distancia se ha actualizado con éxito'
        });
      });
    } else {
      distancia.organizadorId = this.organizadorId;
      distancia.carreraId = this.carreraId;
      this.service.create(distancia).subscribe(distanciaNew => {
        this.distancias.push(distanciaNew);
        Swal.fire({
          icon: 'success',
          title: 'Distancia Creada',
          text: 'La distancia se ha creado con éxito'
        });
      });
    }
    this.resetDistanciaSelected();
  }

  onUpdateDistancia(distanciaRow: Distancia) {
    this.distanciaSelected = { ...distanciaRow };
  }

  onRemoveDistancia(id: number): void {
    this.service.remove(id).subscribe(() => {
      this.distancias = this.distancias.filter(distancia => distancia.id !== id);
      Swal.fire({
        icon: 'success',
        title: 'Carrera Eliminada',
        text: 'La carrera se ha eliminado con éxito'
      });
    });
  }

  private resetDistanciaSelected() {
    this.distanciaSelected = new Distancia();
    this.distanciaSelected.organizadorId = this.organizadorId;
    this.distanciaSelected.carreraId = this.carreraId;
  }
}
