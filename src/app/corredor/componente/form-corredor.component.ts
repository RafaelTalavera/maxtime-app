import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Corredor } from '../models/corredor';

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

  @Output() newCorredorEvent = new EventEmitter<Corredor>();

  ngOnInit(): void {
    console.log('Valor de tipo:', this.tipo);
    console.log('Valor de valor:', this.valor);
  }

  ngAfterViewInit(): void {}

  onSubmit(corredorForm: NgForm): void {
    if (corredorForm.valid) {
      console.log("Form is valid. Emitting newCorredorEvent.");
      this.newCorredorEvent.emit(this.corredor);
    } else {
      console.error("Form is invalid.");
    }
    corredorForm.reset();
    corredorForm.resetForm();
  }

  clean(): void {
    this.corredor = new Corredor();
  }
}
