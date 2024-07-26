import { Component, OnInit } from '@angular/core';
import { Distancia } from '../../models/distancia';
import { DistanciaService } from '../../services/distancia.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormDistanciaComponent } from "../form-distancia/form-distancia.component";

@Component({
  selector: 'app-distancias',
  standalone: true,
  templateUrl: './distancias.component.html',
  styleUrls: ['./distancias.component.css'],
  imports: [FormDistanciaComponent]
})
export class DistanciasComponent implements OnInit{
  
  carreraId!: number;
  organizadorId!: number;
  distancias: Distancia[] = [];
  distanciaSelected: Distancia = new Distancia();

  constructor(private service: DistanciaService,  private route: ActivatedRoute) {}
   
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.carreraId = +params['carreraId'];
      this.organizadorId = +params['organizadorId'];
      this.distanciaSelected.organizadorId = this.organizadorId;
      this.distanciaSelected.carreraId = this.carreraId;
    });
  
    this.service.findAll(this.organizadorId, this.carreraId).subscribe(distancias => {
     
      this.distancias = distancias; 
    });
  }

  addDistancia(distancia: Distancia) {
    if (distancia.id > 0) {
      this.service.updateDistancia(distancia).subscribe(distanciaUpdated => {
        this.distancias = this.distancias.map(dist => dist.id == distancia.id ? distanciaUpdated: dist);
        Swal.fire({
          icon: 'success',
          title: 'Distancia Actualizada',
          text: 'La distancia se ha actualizado con éxito',
        });
      });
    } else {
      distancia.organizadorId = this.organizadorId;
      distancia.carreraId = this.carreraId;
      this.service.create(distancia).subscribe(distanciaNew => {
        this.distancias.push(distanciaNew);
        Swal.fire({
          icon: 'success',
          title: 'Distancia Creada',
          text: 'La distancia se ha creado con éxito',
        });
        });
      }
      this.distanciaSelected = new Distancia();
      this.distanciaSelected.organizadorId = this.organizadorId;
      this.distanciaSelected.carreraId = this.carreraId;
  }

onUpdateDistancia(ditanciaRow: Distancia){
  this.distanciaSelected = { ...ditanciaRow};
}

onRemoveDistancia(id:number): void {
  this.service.remove(id).subscribe(()=>{
    this.distancias = this.distancias.filter(distancia => distancia.id !== id );
    Swal.fire({
      icon: 'success',
      title: 'Carrera Eliminada',
      text: 'La carrera se ha eliminado con éxito',
    });
  });
}
}
