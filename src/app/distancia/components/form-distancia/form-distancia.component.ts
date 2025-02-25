import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Distancia } from '../../models/distancia';
import { LoadingService } from '../../../servicios/loading.service';


@Component({
  selector: 'app-form-distancia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-distancia.component.html',
  styleUrls: ['./form-distancia.component.css']
})
export class FormDistanciaComponent implements AfterViewInit {
  ngAfterViewInit(): void {}

  @Input() distancia: Distancia = new Distancia();
  @Output() newDistanciaEvent = new EventEmitter<Distancia>();

  linkDePagoLabels: string[] = [];

  constructor(public loadingService: LoadingService) {} // Inyección del servicio de carga

  onSubmit(distanciaForm: NgForm): void {
    if (distanciaForm.valid) {
      this.loadingService.startIconChange(); // Activar la animación de carga

      const jsonToSend = {
        id: this.distancia.id,
        tipo: this.distancia.tipo,
        valor: this.distancia.valor,
        pagos: this.distancia.pagos.map(metodo => ({
          metodoPago: metodo.metodoPago,
          linkDePago: metodo.linkDePago
        })),
        carreraId: this.distancia.carreraId,
        organizadorId: this.distancia.organizadorId
      };

      console.log('JSON to send:', JSON.stringify(jsonToSend, null, 2));

      // Simulación de respuesta del servidor con retraso
      setTimeout(() => {
        this.newDistanciaEvent.emit(jsonToSend);
        this.loadingService.stopIconChange(); // Detener la animación de carga
        this.clean();
      }, 3000); // Simulación de 3 segundos
    }
  }

  clean(): void {
    this.distancia = new Distancia();
    this.linkDePagoLabels = [];
    console.log('Formulario limpiado:', this.distancia);
  }

  updateLabel(metodoPago: string, index: number): void {
    switch (metodoPago) {
      case 'Efectivo':
        this.linkDePagoLabels[index] = 'Dirección';
        break;
      case 'Transferencia Bancaria':
        this.linkDePagoLabels[index] = 'Elija CBU o Alias';
        break;
      case 'MercadoPago':
        this.linkDePagoLabels[index] = 'Coloque aquí el link de Mercado Pago';
        break;
      default:
        this.linkDePagoLabels[index] = 'Link de Pago';
    }
  }

  addMetodoPago(): void {
    console.log('Añadiendo método de pago. Estado actual:', this.distancia.pagos);

    const nuevoMetodo = { metodoPago: '', linkDePago: '' };
    this.distancia.pagos = [...this.distancia.pagos, nuevoMetodo];
    this.linkDePagoLabels = [...this.linkDePagoLabels, 'Link de Pago'];

    console.log('Método de pago añadido. Estado nuevo:', this.distancia.pagos);
  }

  removeMetodoPago(index: number): void {
    if (this.distancia.pagos.length > 0) {
      this.distancia.pagos.splice(index, 1);
      this.linkDePagoLabels.splice(index, 1);
    }
  }
}
