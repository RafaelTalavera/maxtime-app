import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-payment-modal',
  standalone: true, // Declararlo como standalone
  template: `
    <div class="modal-container">
      <div class="modal-content">
        <h2>Información para hacer el pago aaaaa</h2>
        <p>{{ linkDePago }}</p>
        <div class="button-container">
          <button (click)="copyToClipboard()" class="btn btn-primary">Copiar link</button>
          <button (click)="openLink()" class="btn btn-success">Abrir enlace</button>
          <button (click)="closeModal()" class="btn btn-secondary">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./payment-modal.component.css'],
})
export class PaymentModalComponent {
  @Input() linkDePago: string = '';
  @Output() close = new EventEmitter<void>();

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.linkDePago).then(() => {
      alert('¡Link copiado al portapapeles!');
    });
  }

  openLink(): void {
    window.open(this.linkDePago, '_blank');
  }

  closeModal(): void {
    this.close.emit();
  }
}
