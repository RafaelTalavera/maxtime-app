import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Corredor } from '../models/corredor';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { CorredorService } from '../service/corredor.service';
import { CarreasService } from '../../carrera/services/carreras.service';
import { PaymentModalComponent } from '../../payment-modal/payment-modal.component';
import { CodigoDescuentoService } from '../../descuento/descuento-service';

@Component({
  selector: 'app-form-corredor',
  standalone: true,
  templateUrl: './form-corredor.component.html',
  styleUrls: ['./form-corredor.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FormsModule, CommonModule, PaymentModalComponent]
})
export class FormCorredorComponent implements OnInit, AfterViewInit {
  @Input() corredor: Corredor = new Corredor();
  @Input() tipo!: string;
  @Input() valor!: number;
  @Input() carreraId!: number;
  @Input() distanciaId!: number;
  @Input() linkDePago!: string;
  @Input() metodoPago!: string;

  talles: string[] = [];
  categorias: string[] = []; // Arreglo para las combinaciones de categorías
  edad: number | null = null;
  showPaymentModal: boolean = false;

  // Variables para código de descuento
  codigoDescuento: string = '';
  descuentoAplicado: number = 0;
  codigoAplicado: boolean = false;

  constructor(
    private corredorService: CorredorService,
    private carreraService: CarreasService,
    private codigoDescuentoService: CodigoDescuentoService
  ) {}

  ngOnInit(): void {
    // Inicializa los IDs en el corredor
    this.corredor.carreraId = this.carreraId;
    this.corredor.distanciaId = this.distanciaId;

    console.log('Datos recibidos:', {
      tipo: this.tipo,
      valor: this.valor,
      carreraId: this.carreraId,
      distanciaId: this.distanciaId
    });

    // Obtener talles (se espera que el endpoint retorne un array con un string separado por comas)
    this.carreraService.getTallesByCarreraId(this.carreraId).subscribe({
      next: (tallesData) => {
        if (tallesData && tallesData.length > 0 && typeof tallesData[0] === 'string') {
          this.talles = tallesData[0].split(',').map(t => t.trim());
        } else {
          this.talles = [];
        }
      },
      error: (err) => {
        console.error('Error al obtener talles:', err);
      }
    });

    // Obtener categorías disponibles (endpoint creado en el back)
    this.carreraService.getCategoriasByCarreraId(this.carreraId).subscribe({
      next: (cats) => {
        this.categorias = cats || [];
      },
      error: (err) => {
        console.error('Error al obtener categorías:', err);
        this.categorias = [];
      }
    });

    // Inicializa corredor para nueva inscripción
    this.corredor = new Corredor();
    this.corredor.carreraId = this.carreraId;
    this.corredor.distanciaId = this.distanciaId;
  }

  ngAfterViewInit(): void { }

  validarCodigo(): void {
    if (!this.codigoDescuento.trim()) {
      Swal.fire('Código requerido', 'Ingrese un código de descuento antes de validar.', 'warning');
      return;
    }
    this.codigoDescuentoService.validarCodigoDescuento(this.carreraId, this.codigoDescuento)
      .subscribe((codigo) => {
        if (codigo) {
          this.descuentoAplicado = (this.valor * codigo.porcentajeDescuento) / 100;
          this.valor -= this.descuentoAplicado;
          this.codigoAplicado = true;
          this.corredor.codigoDescuento = this.codigoDescuento;
          Swal.fire('Descuento aplicado', `Se ha aplicado un ${codigo.porcentajeDescuento}% de descuento.`, 'success');
        }
      });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      Object.keys(form.controls).forEach(controlName => {
        const control = form.controls[controlName];
        control.markAsTouched();
      });
      return;
    }
    if (this.codigoAplicado && this.codigoDescuento.trim()) {
      this.corredor.codigoDescuento = this.codigoDescuento;
    }
    this.corredorService.create(this.corredor).subscribe(
      (corredorNew) => {
        Swal.fire({
          icon: 'success',
          title: 'Felicitaciones, usted se inscribió con éxito.',
          text: 'Recuerde siempre enviar el comprobante de pago para confirmación.',
          showCancelButton: true,
          confirmButtonText: 'Pagar ahora',
          cancelButtonText: 'Más tarde'
        }).then(result => {
          if (result.isConfirmed) {
            if (!this.metodoPago || this.metodoPago === 'MercadoPago') {
              Swal.fire({
                icon: 'info',
                title: 'Información para hacer el pago',
                html: `<p>${this.linkDePago}</p>
                       <button id="copy-button" style="
                           background-color: #3085d6;
                           color: white;
                           border: none;
                           padding: 10px 20px;
                           font-size: 14px;
                           border-radius: 5px;
                           cursor: pointer;
                           margin-top: 10px;
                       ">Copiar link</button>`,
                confirmButtonText: 'Cerrar',
                didOpen: () => {
                  const copyButton = document.getElementById('copy-button');
                  if (copyButton) {
                    copyButton.addEventListener('click', () => {
                      this.copyToClipboard();
                    });
                  }
                },
              }).then(innerResult => {
                if (innerResult.isConfirmed) {
                  window.location.href = this.linkDePago;
                }
              });
            } else {
              window.location.href = this.linkDePago;
            }
          } else {
            window.location.reload();
          }
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Ya existe un corredor con su DNI.',
          text: 'Por favor, comuníquese con el organizador.'
        });
      }
    );
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.linkDePago).then(() => {
      Swal.fire({
        icon: 'success',
        title: '¡Link copiado!',
        text: 'El enlace de pago ha sido copiado al portapapeles.',
        timer: 2000,
        showConfirmButton: false
      });
    }).catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo copiar el enlace al portapapeles.'
      });
      console.error('Error al copiar al portapapeles:', err);
    });
  }

  clean(): void {
    this.corredor = new Corredor();
    this.edad = null;
  }

  calculateAge(): void {
    if (this.corredor.fechaNacimiento) {
      const birthDate = new Date(this.corredor.fechaNacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.edad = age;
    } else {
      this.edad = null;
    }
  }
}
