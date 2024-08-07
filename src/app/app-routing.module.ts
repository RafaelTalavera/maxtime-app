import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrganizadoresComponent } from './organizador/components/organizadores.component';

import { DistanciasComponent } from './distancia/components/distancias/distancias.component';
import { CorredorComponent } from './corredor/componente/corredor.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { ControlComponent } from './control/componente/control.component';
import { NosotrosComponent } from './home/nosotros/nosotros.component';
import { PublicacionCarreraComponent } from './publicacion-carrera/components/publicacion-carrera.component';
import { MenuAdministradorComponent } from './menu/menu-administrador/menu-administrador.component';


import { ResultsComponent } from './resultados/componets/upload-results/upload-results.component';
import { PublicacionTiemposComponent } from './resultados/componets/publicacion-tiempos/publicacion-tiempos.component';
import { ListadoPosicionesComponent } from './resultados/componets/listado-posiciones/listado-posiciones.component';
import { MenuOrganizadorComponent } from './menu/menu-organizador/menu-organizador.component';
import { CarreraOrganizadorComponent } from './carrera/organizador/components/carrera-organizador.component';
import { CarreraComponent } from './carrera/administrador/components/carrera.component';
import { ListadoCarrerasComponent } from './carrera/administrador/menu-administrador/listado-carreras/listado-carreras.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'organizadores', component: OrganizadoresComponent },
  { path: 'carreras', component: CarreraComponent },
  { path: 'distancias', component: DistanciasComponent },
  { path: 'publicacion-carreras', component: PublicacionCarreraComponent },
  { path: 'inscripcion', component: CorredorComponent },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'control', component: ControlComponent },
  { path: 'home', component: HomeComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'menu-administrador', component: MenuAdministradorComponent},
  { path: 'carga-resultados', component: ResultsComponent },
  { path: 'listado-carreras', component: ListadoCarrerasComponent}, 
  { path: 'publicacion-tiempos', component: PublicacionTiemposComponent },
  { path: 'posiciones/:carreraId', component: ListadoPosicionesComponent },
  { path: 'menu-organizador', component: MenuOrganizadorComponent},
  { path: 'carrera-organizador', component: CarreraOrganizadorComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
