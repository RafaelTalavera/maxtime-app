import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Organizador } from '../../models/organizador';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-organizador.component.html',
  styleUrl: './form-organizador.component.css'
})
export class FormOrganizadorComponent {

 @Input() organizador: Organizador = {
    id:0,
    username: '',
    apellido: '',
    dni: '',
    nombre: '',
    telefono: '',
    password: '',
   
  };

  @Output() newOrganizadorEvent = new EventEmitter();

  onSubmit(organizadorForm: NgForm): void {
    if (organizadorForm.valid){
      this.newOrganizadorEvent.emit(this.organizador);
    }
    organizadorForm.reset();
    organizadorForm.resetForm();
  }

  clean(): void{
    this.organizador = {
    id:0,
    username: '',
    apellido: '',
    dni: '',
    nombre: '',
    telefono: '',
    password: '',
   
  };
}
}
