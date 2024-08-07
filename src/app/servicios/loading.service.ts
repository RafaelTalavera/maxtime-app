import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading: boolean = true;
  private iconClasses: string[] = ['fas fa-stopwatch', 'fas fa-running','fas fa-stopwatch', 'fas fa-swimmer','fas fa-stopwatch', 'fas fa-stopwatch', 'fas fa-biking','fas fa-stopwatch'];
  private currentIconIndex: number = 0;
  private iconChangeInterval: any;
  private intervalDuration: number = 300; // Duración del intervalo en milisegundos

  startIconChange(): void {
    this.isLoading = true; // Reiniciar el estado de carga
    this.iconChangeInterval = setInterval(() => {
      const spinnerElement = document.querySelector('.loading-spinner');
      if (spinnerElement) {
        this.currentIconIndex = (this.currentIconIndex + 1) % this.iconClasses.length;
        spinnerElement.className = `loading-spinner ${this.iconClasses[this.currentIconIndex]}`;
      }
    }, this.intervalDuration); // Cambia el ícono cada "intervalDuration" milisegundos
  }

  stopIconChange(): void {
    this.isLoading = false; // Parar el estado de carga
    if (this.iconChangeInterval) {
      clearInterval(this.iconChangeInterval);
    }
  }
}
