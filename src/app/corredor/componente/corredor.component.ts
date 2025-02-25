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
  imports: [FormCorredorComponent, FormsModule, CommonModule],
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
  metodoPago: string = '';
  showPaymentModal: boolean = false;

  constructor(
    private service: CorredorService,
    private distanciaService: DistanciaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Parámetros recibidos:', params); // Ver qué valores llegan
  
      this.carreraId = Number(params['carreraId']);
      this.distanciaId = Number(params['distanciaId']);
      this.tipo = params['tipo'];
      this.linkDePago = params['linkDePago'];
      this.metodoPago = params['metodoPago'];
  
      // Depuración del valor antes de asignarlo
      const valorString = params['valor'];
      console.log('Valor recibido como string:', valorString);
  
      if (!isNaN(Number(valorString))) {
        this.valor = Number(valorString);
      } else {
        console.error('Error: Valor no es un número válido');
        this.valor = 0; // O asigna un valor por defecto
      }
  
      this.corredorSelected = new Corredor();
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

      this.service.update(corredor).subscribe(
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
            text: 'Recuerde siempre enviar el comprobante de pago para confirmación.',
            showCancelButton: true,
            confirmButtonText: 'Pagar ahora',
            cancelButtonText: 'Más tarde',
          }).then((result) => {
            if (result.isConfirmed) {
              if (this.metodoPago !== 'MercadoPago') {
                // Muestra el mensaje con el link de pago si no es MercadoPago
                Swal.fire({
                  icon: 'info',
                  title: 'Información para hacer el pago',
                  text: this.linkDePago,
                  confirmButtonText: 'cerrar',
                  showCancelButton: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    window.location.href = this.linkDePago;
                  }
                });
              } else {
                // Redirecciona directamente si es MercadoPago
                window.location.href = this.linkDePago;
              }
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

    this.service.delete(id).subscribe(() => {
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

  pagarCorredor(corredor: Corredor): void {
    if (this.metodoPago !== 'MercadoPago') {
      this.showPaymentModal = true;
    } else {
      window.location.href = this.linkDePago;
    }
  }
  
  closePaymentModal(): void {
    this.showPaymentModal = false;
  }
  
  

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.linkDePago).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Link copiado',
        text: 'El enlace de pago ha sido copiado al portapapeles.',
        timer: 2000,
        showConfirmButton: false,
      });
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo copiar el enlace al portapapeles.',
      });
      console.error('Error al copiar al portapapeles: ', err);
    });
  }
  
  
}
