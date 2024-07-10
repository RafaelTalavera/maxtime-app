import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Corredor } from '../models/corredor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-corredor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './form-corredor.component.html',
  styleUrls: ['./form-corredor.component.css']
})
export class FormCorredorComponent implements AfterViewInit {
  @Input() corredor: Corredor = new Corredor();
  @Input() tipo!: string;
  @Input() valor!: number;
  edad: number | null = null;

  @Output() newCorredorEvent = new EventEmitter<Corredor>();

  ngOnInit(): void {
    console.log('Valor de tipo:', this.tipo);
    console.log('Valor de valor:', this.valor);
  }

  ngAfterViewInit(): void {}

  onSubmit(corredorForm: NgForm): void {
    if (corredorForm.valid) {
      this.newCorredorEvent.emit(this.corredor);
    } else {
      console.error("Form is invalid.");
    }
    corredorForm.resetForm();
  }

  clean(): void {
    this.corredor = new Corredor();
  }

  showSuccessAlert(message: string): void {
    Swal.fire('¡Éxito!', message, 'success');
  }

  showErrorAlert(message: string): void {
    Swal.fire('¡Error!', message, 'error');
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
