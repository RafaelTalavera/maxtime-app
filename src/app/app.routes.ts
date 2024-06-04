import { Routes } from '@angular/router';
import { OrganizadoresComponent } from './organizador/components/organizadores.component';
import { HomeComponent } from './home/home.component';
import { CarreraComponent } from './carrera/components/carrera.component';
import { DistanciasComponent } from './distancia/components/distancias/distancias.component';
import { CarreraListComponent } from './publicacion-carrea/components/publicacion-carrea.component';
import { FormCorredorComponent } from './corredor/componente/form-corredor.component';
import { CorredorComponent } from './corredor/componente/corredor.component';




export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'organizadores', component: OrganizadoresComponent },
  { path: 'carreras', component: CarreraComponent },
  { path: 'distancias', component: DistanciasComponent },
  { path: 'publicacion-carreras', component: CarreraListComponent}, 
  { path: 'inscripcion', component: CorredorComponent}

  
];
