import { Component, OnInit } from '@angular/core';
import { OrganizadoresService } from '../services/organizadores.service';
import { Router } from '@angular/router'; 
import { Organizador } from '../models/organizador';
import Swal from 'sweetalert2';
import { FormComponent } from './form-organizador/form-organizador.component';
import { FormCarreraComponent } from '../../carrera/components/form-carrera/form-carrera.component';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { catchError, of } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-organizadores',
  standalone: true,
  imports: [FormComponent, FormCarreraComponent, CommonModule, FormsModule],
  templateUrl: './organizadores.component.html',
  styleUrls: ['./organizadores.component.css'],

})
export class OrganizadoresComponent implements OnInit {

  organizadores: Organizador[] = [];
  showError: boolean = false;
  dniBusqueda: string = '';
  organizadoresFiltrados: Organizador[] = [];

  organizadorSelected: Organizador = new Organizador();

  constructor(private service: OrganizadoresService, private router: Router) {}

  ngOnInit(): void {
    this.service.findAll().pipe(
      catchError((error) => {
        console.error('Error fetching organizadores:', error);
        if (error.status !== 200) {
          this.showError = true;
        }
        return of([]); // Return an empty array or appropriate default value on error
      })
    ).subscribe(
      (organizadores) => {
        console.log('Organizadores data:', organizadores);
        this.organizadores = organizadores;
        this.buscarPorDNI(); // Inicializa la lista filtrada
      }
    );
  }

  addOrganizador(organizador: Organizador) {
    if (organizador.id > 0) {
      this.service.updateOrganizador(organizador).subscribe(organizadorUpdated => {
        this.organizadores = this.organizadores.map(org => org.id === organizador.id ? organizadorUpdated : org);
        Swal.fire({
          icon: 'success',
          title: 'Organizador Actualizado',
          text: 'El organizador se ha actualizado con éxito',
        });
      });
    } else {
      this.service.create(organizador).subscribe(organizadorNew => {
        this.organizadores.push(organizadorNew);
        Swal.fire({
          icon: 'success',
          title: 'Organizador Creado',
          text: 'El organizador se ha creado con éxito',
        });
      });
    }
    this.organizadorSelected = new Organizador();
  }

  onUpdateOrganizador(organizadorRow: Organizador) {
    this.organizadorSelected = { ...organizadorRow };
  }

  onRemoveOrganizador(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Estás seguro de que deseas eliminar este organizador?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.remove(id).subscribe(() => {
          this.organizadores = this.organizadores.filter(organizador => organizador.id !== id);
          Swal.fire({
            icon: 'success',
            title: 'Organizador Eliminado',
            text: 'El organizador se ha eliminado con éxito',
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: 'info',
          title: 'Eliminación cancelada',
          text: 'La eliminación del organizador ha sido cancelada',
        });
      }
    });
  }

  asignarCarrera(organizadorId: number | undefined): void {
    if (organizadorId === undefined) {
      return;
    }
    this.router.navigate(['/carreras', { organizadorId }]);
  }

  buscarPorDNI(): void {
    if (this.dniBusqueda.trim() === '') {
      this.organizadoresFiltrados = this.organizadores;
    } else {
      this.organizadoresFiltrados = this.organizadores.filter(organizador =>
        organizador.dni.toLowerCase().includes(this.dniBusqueda.toLowerCase())
      );
    }
  }

  trackByFn(index: number, item: Organizador): number {
    return item.id; // O cualquier campo único en tu objeto Organizador
  }
  
  
}
