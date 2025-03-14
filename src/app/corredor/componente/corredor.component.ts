import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Corredor } from '../models/corredor';
import { CorredorService } from '../service/corredor.service';
import { DistanciaService } from '../../distancia/services/distancia.service';
import { FormCorredorComponent } from './form-corredor.component';
import { FormsModule } from '@angular/forms';
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
      console.log('Parámetros recibidos:', params);

      this.carreraId = Number(params['carreraId']);
      this.distanciaId = Number(params['distanciaId']);
      this.tipo = params['tipo'];
      this.linkDePago = params['linkDePago'];
      this.metodoPago = params['metodoPago'];

      const valorString = params['valor'];
      console.log('Valor recibido como string:', valorString);
      this.valor = !isNaN(Number(valorString)) ? Number(valorString) : 0;

      // Inicializa corredorSelected con los IDs de carrera y distancia
      this.corredorSelected = new Corredor();
      this.corredorSelected.carreraId = this.carreraId;
      this.corredorSelected.distanciaId = this.distanciaId;
    });
  }

  findCorredores(): void {
    console.log("findCorredores invocado con DNI:", this.dni);
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

      this.service.findAll(this.dni).subscribe(
        corredores => {
          console.log("Corredores encontrados:", corredores);
          this.corredores = corredores;
          Swal.close();
        },
        error => {
          console.error("Error al buscar corredores:", error);
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error al Buscar Corredores',
            text: 'Hubo un problema al buscar los corredores.'
          });
        }
      );
    }
  }

  addCorredor(corredor: Corredor): void {
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
          console.log("Corredor actualizado:", corredorUpdated);
          this.corredores = this.corredores.map(c =>
            c.id === corredor.id ? corredorUpdated : c
          );
          Swal.fire({
            icon: 'success',
            title: 'Corredor Actualizado',
            text: 'El corredor se ha actualizado con éxito'
          });
        },
        error => {
          console.error("Error al actualizar corredor:", error);
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Error al Actualizar Corredor',
            text: 'Hubo un problema al actualizar el corredor'
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
          console.log("Nuevo corredor creado:", corredorNew);
          this.corredores.push(corredorNew);
          Swal.fire({
            icon: 'success',
            title: 'Felicitaciones, usted se inscribió con éxito.',
            text: 'Recuerde siempre enviar el comprobante de pago para confirmación.',
            showCancelButton: true,
            confirmButtonText: 'Pagar ahora',
            cancelButtonText: 'Más tarde'
          }).then(result => {
            if (result.isConfirmed) {
              console.log("El usuario eligió pagar ahora.");
              this.pagarCorredor(corredorNew);
            }
          });
        },
        error => {
          console.error("Error al crear inscripción:", error);
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Ya existe un DNI igual al que ingresó',
            text: 'Verifique si lo ingresó correctamente o comuníquese con el organizador.'
          });
        }
      );
    }
    // Reinicia corredorSelected para nueva inscripción
    this.corredorSelected = new Corredor();
    this.corredorSelected.carreraId = this.carreraId;
    this.corredorSelected.distanciaId = this.distanciaId;
  }

  onUpdateCorredor(corredorRow: Corredor): void {
    console.log("onUpdateCorredor invocado con:", corredorRow);
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
      console.log("Corredor eliminado, id:", id);
      this.corredores = this.corredores.filter(corredor => corredor.id !== id);
      Swal.fire({
        icon: 'success',
        title: 'Corredor Eliminado',
        text: 'El corredor se ha eliminado con éxito'
      });
    });
  }

  trackByIndex(index: number, corredor: Corredor): number {
    return corredor.id;
  }

  goToLink(url: string): void {
    console.log("Abriendo link:", url);
    window.open(url, '_blank');
  }

  pagarCorredor(corredor: Corredor): void {
    console.log("pagarCorredor invocado para corredor:", corredor);
    console.log("metodoPago:", this.metodoPago, "linkDePago:", this.linkDePago);
    if (!this.metodoPago || this.metodoPago === 'MercadoPago') {
      Swal.fire({
        icon: 'info',
        title: 'Información para hacer el pago',
        html: `
          <p>${this.linkDePago}</p>
          <button id="copy-button" style="
              background-color: #3085d6;
              color: white;
              border: none;
              padding: 10px 20px;
              font-size: 14px;
              border-radius: 5px;
              cursor: pointer;
              margin-top: 10px;
          ">Copiar link</button>
        `,
        confirmButtonText: 'Cerrar',
        didOpen: () => {
          const copyButton = document.getElementById('copy-button');
          if (copyButton) {
            copyButton.addEventListener('click', () => {
              this.copyToClipboard();
            });
          }
        },
      }).then((innerResult) => {
        if (innerResult.isConfirmed) {
          window.location.href = this.linkDePago;
        }
      });
    } else {
      window.location.href = this.linkDePago;
    }
  }
  
  

  closePaymentModal(): void {
    console.log("Modal de pago cerrado");
    this.showPaymentModal = false;
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.linkDePago).then(() => {
      console.log("Link copiado:", this.linkDePago);
      Swal.fire({
        icon: 'success',
        title: 'Link copiado',
        text: 'El enlace de pago ha sido copiado al portapapeles.',
        timer: 2000,
        showConfirmButton: false
      });
    }).catch(err => {
      console.error("Error al copiar al portapapeles:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo copiar el enlace al portapapeles.'
      });
    });
  }
}
