import { Component, OnInit } from '@angular/core';
import { Corredor } from '../../corredor/models/corredor';
import Swal from 'sweetalert2';

import { ActivatedRoute, Router } from '@angular/router';
import { ControlService } from '../service/control-service';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css'
})
export class ControlComponent implements OnInit{

  corredores: Corredor[] = [];
  corredoresFiltrados: Corredor[] = [];
  showError: boolean = false;
  dniBusqueda: string = '';


  constructor(
    private service: ControlService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}
 
 
 
  ngOnInit(): void {
    this.service.findAll().pipe(
      catchError((error) => {
        console.error('Error fetching corredores:', error);
        if (error.status !== 200) {
          this.showError = true;
        }
        return of([]); // Return an empty array or appropriate default value on error
      })
    ).subscribe(
      (corredores) => {
        console.log('corredores data:', corredores);
        this.corredores = corredores;
        this.buscarPorDNI(); // Llama a buscarPorDNI() después de obtener la lista de corredores
      }
    );
  }

  toggleConfirmado(corredor: Corredor): void {
    // Mostrar un mensaje de confirmación
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea confirmar el estado?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, realizar el cambio de estado
        this.service.toggleConfirmado(corredor.id).subscribe(
          () => {
            console.log('Confirmado status updated successfully');
            // Actualizar el estado del corredor en la lista de corredores
            const index = this.corredores.findIndex(c => c.id === corredor.id);
            if (index !== -1) {
              // Cambiar el estado de confirmado del corredor en la lista
              this.corredores[index].confirmado = !this.corredores[index].confirmado;
            }
          },
          (error) => {
            console.error('Error updating confirmado status:', error);
          }
        );
      }
    });
  }

  buscarPorDNI(): void {
    if (this.dniBusqueda.trim() === '') {
      // Si el campo de búsqueda está vacío, muestra todos los corredores
      this.corredoresFiltrados = this.corredores;
    } else {
      // Si hay un valor en el campo de búsqueda, filtra los corredores por DNI
      this.corredoresFiltrados = this.corredores.filter(corredor =>
        corredor.dni.toLowerCase().includes(this.dniBusqueda.toLowerCase())
      );
    }
  }

  trackByFn(index: number, item: Corredor): number {
    return item.id; // O cualquier campo único en tu objeto Corredor
  }
}
