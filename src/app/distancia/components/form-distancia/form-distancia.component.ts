
import { AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { Distancia } from "../../models/distancia";
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-distancia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-distancia.component.html',
  styleUrls: ['./form-distancia.component.css']
})
export class FormDistanciaComponent implements AfterViewInit {
  ngAfterViewInit(): void {}

  @Input() distancia: Distancia = {
    id: 0,
    tipo: '',
    valor: 0,
    linkDePago: '', 
    metodoPago: '',   
    carreraId: 0,
    organizadorId: 0,
  };

  @Output() newDistanciaEvent = new EventEmitter<Distancia>(); // Specify the type

  linkDePagoLabel: string = 'Link de Pago';

  onSubmit(distanciaForm: NgForm): void {
    if (distanciaForm.valid) {
      this.newDistanciaEvent.emit(this.distancia);
    }
    distanciaForm.reset();
    distanciaForm.resetForm();
  }

  clean(): void {
    this.distancia = {
      id: 0,
      tipo: '',
      valor: 0,
      metodoPago: '',  
      linkDePago: '',    
      carreraId: 0,
      organizadorId: 0,
    };
    this.linkDePagoLabel = 'Link de Pago';
  }

  updateLabel(metodoPago: string): void {
    switch (metodoPago) {
      case 'Efectivo':
        this.linkDePagoLabel = 'Dirección';
        break;
      case 'Transferencia Bancaria':
        this.linkDePagoLabel = 'Elija CBU o Alias';
        break;
      case 'MercadoPago':
        this.linkDePagoLabel = 'Coloque aquí el link de Mercado Pago';
        break;
      default:
        this.linkDePagoLabel = 'Link de Pago';
    }
  }
}
