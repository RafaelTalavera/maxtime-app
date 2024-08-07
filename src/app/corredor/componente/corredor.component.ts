import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Corredor } from '../models/corredor';
import { CorredorService } from '../service/corredor.service';
import { DistanciaService } from '../../distancia/services/distancia.service';
import { FormCorredorComponent } from './form-corredor.component';
import { FormsModule } from '@angular/forms';
import { PublicacionCarreraComponent } from '../../publicacion-carrera/components/publicacion-carrera.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-corredor',
  standalone: true,
  templateUrl: './corredor.component.html',
  styleUrls: ['./corredor.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FormCorredorComponent, PublicacionCarreraComponent, FormsModule, CommonModule],
})
export class CorredorComponent implements OnInit {
  corredores: Corredor[] = [];
  corredorSelected: Corredor = new Corredor();

  carreraId!: number;
  distanciaId!: number;
  tipo!: string;
  valor!: number;
  dni!: string;
  linkDePago: string = '';

  constructor(
    private service: CorredorService, 
    private distanciaService: DistanciaService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.carreraId = +params['carreraId'];
      this.distanciaId = +params['distanciaId'];
      this.tipo = params['tipo'];
      this.linkDePago = params['linkDePago'];
      this.corredorSelected = new Corredor();

      this.corredorSelected.carreraId = this.carreraId;
      this.corredorSelected.distanciaId = this.distanciaId;
    });
  }

  findCorredores(): void {
    if (this.dni) {
      Swal.fire({
        title: 'Por favor espere',
        text: 'Buscando corredores...',
        icon: 'info',
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.service.findAll(this.dni).subscribe(corredores => {
        this.corredores = corredores;
        Swal.close(); // Cerrar el mensaje de carga
      }, error => {
        Swal.close(); // Cerrar el mensaje de carga
        Swal.fire({
          icon: 'error',
          title: 'Error al Buscar Corredores',
          text: 'Hubo un problema al buscar los corredores.',
        });
      });
    }
  }

  addCorredor(corredor: Corredor) {
    if (corredor.id > 0) {
      Swal.fire({
        title: 'Por favor espere',
        text: 'Actualizando corredor...',
        icon: 'info',
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.service.updateCorredor(corredor).subscribe(
        corredorUpdated => {
          this.corredores = this.corredores.map(corre => corre.id === corredor.id ? corredorUpdated : corre);
          Swal.fire({
            icon: 'success',
            title: 'Corredor Actualizado',
            text: 'El corredor se ha actualizado con éxito',
          });
        },
        error => {
          Swal.close(); // Cerrar el mensaje de carga
          Swal.fire({
            icon: 'error',
            title: 'Error al Actualizar Corredor',
            text: 'Hubo un problema al actualizar el corredor',
          });
        }
      );
    } else {
      corredor.carreraId = this.carreraId;
      corredor.distanciaId = this.distanciaId;
      Swal.fire({
        title: 'Por favor espere',
        text: 'Creando inscripción...',
        icon: 'info',
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.service.create(corredor).subscribe(
        corredorNew => {
          this.corredores.push(corredorNew);
          Swal.fire({
            icon: 'success',
            title: 'Felicitaciones, usted se inscribió con éxito.',
            text: 'Recuerde siempre enviar el comprobate de pago para confirmación.',
            showCancelButton: true,
            confirmButtonText: 'Pagar ahora',
            cancelButtonText: 'Más tarde',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = this.linkDePago; 
            }
          });
        },
        error => {
          Swal.close(); // Cerrar el mensaje de carga
          Swal.fire({
            icon: 'error',
            title: 'Ya existe un DNI igual al que ingresó',
            text: 'Verifique si lo ingresó correctamente o comuníquese con el organizador.',
          });
        }
      );
    }
    this.corredorSelected = new Corredor();
    this.corredorSelected.carreraId = this.carreraId;
    this.corredorSelected.distanciaId = this.distanciaId;
  }

  onUpdateCorredor(corredorRow: Corredor) {
    this.corredorSelected = { ...corredorRow };
  }

  onRemoveCorredor(id: number): void {
    Swal.fire({
      title: 'Por favor espere',
      text: 'Eliminando corredor...',
      icon: 'info',
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.service.remove(id).subscribe(() => {
      this.corredores = this.corredores.filter(corredor => corredor.id !== id);
      Swal.fire({
        icon: 'success',
        title: 'Corredor Eliminado',
        text: 'El corredor se ha eliminado con éxito',
      });
    });
  }

  trackByIndex(index: number, corredor: Corredor): number {
    return corredor.id;
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }
}
