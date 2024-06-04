import { Component, OnInit } from '@angular/core';
import { OrganizadoresService } from '../services/organizadores.service';
import { Router } from '@angular/router'; 
import { Organizador } from '../models/organizador';
import { FormComponent } from './form-organizador/form-organizador.component';
import Swal from 'sweetalert2';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormCarreraComponent } from '../../carrera/components/form-carrera/form-carrera.component';

@Component({
  selector: 'app-organizadores',
  standalone: true,
  imports: [FormComponent, FormCarreraComponent],
  templateUrl: './organizadores.component.html',
  styleUrls: ['./organizadores.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrganizadoresComponent implements OnInit {

  organizadores: Organizador[] = [];

  organizadorSelected: Organizador = new Organizador();

  constructor(private service: OrganizadoresService, private router: Router) {}

  ngOnInit(): void {
    this.service.findAll().subscribe(organizadores => {
      this.organizadores = organizadores;
    });
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
    console.log('onUpdateOrganizador function called');
    console.log('organizadorRow:', organizadorRow);
  
    this.organizadorSelected = { ...organizadorRow };
  
    console.log('organizadorSelected after update:', this.organizadorSelected);
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
        // El usuario ha confirmado la eliminación
        this.service.remove(id).subscribe(() => {
          this.organizadores = this.organizadores.filter(organizador => organizador.id !== id);
          Swal.fire({
            icon: 'success',
            title: 'Organizador Eliminado',
            text: 'El organizador se ha eliminado con éxito',
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // El usuario ha cancelado la eliminación
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
}
