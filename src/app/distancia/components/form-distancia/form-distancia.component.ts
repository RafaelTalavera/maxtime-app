import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Distancia } from '../../models/distancia';

@Component({
  selector: 'app-form-distancia',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-distancia.component.html',
  styleUrl: './form-distancia.component.css'
})
export class FormDistanciaComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    }

  @Input() distancia: Distancia = {
    id: 0,
    tipo:'',
    valor: 0,
    linkDePago: '',    
    carreraId: 0,
    organizadorId: 0,
    
  };

  @Output() newDistanciaEvent = new EventEmitter();

  
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
    tipo:'',
    valor: 0,
    linkDePago: '',    
    carreraId: 0,
    organizadorId: 0,
    };

  }
}
