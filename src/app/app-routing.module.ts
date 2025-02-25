import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrganizadoresComponent } from './organizador/components/organizadores.component';

import { DistanciasComponent } from './distancia/components/distancias/distancias.component';
import { CorredorComponent } from './corredor/componente/corredor.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/central/menu.component';
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
import { ListOrganizadoresComponent } from './menu/menu-admin-organizadores/list-organizadores.component';
import { ListCarrerasOrganizadorComponent } from './menu/menu-organizador/list-carreras-organizador/list-carreras-organizador.component';
import { LitPauseCarreraComponent } from './menu/menu-organizador/lit-pause-carrera/lit-pause-carrera.component';
import { LitStopCarreraComponent } from './menu/menu-organizador/lit-stop-carrera/lit-stop-carrera.component';
import { CrudPortadasComponent } from './portadas/crud-portadas/crud-portadas.component';
import { PortadasComponent } from './portadas/portadas.component';
import { DescuentosComponent } from './descuento/descuentos.component';
import { ListaCarrerasComponent } from './descuento/lista-carreras.component';


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
  { path: 'list-organizadores', component: ListOrganizadoresComponent },
  { path: 'carrera-organizador', component: CarreraOrganizadorComponent},
  { path: 'lista-carrera-organizador', component: ListCarrerasOrganizadorComponent },
  { path: 'lista-carrera-pausa', component: LitPauseCarreraComponent},
  { path: 'lista-carrera-stop', component: LitStopCarreraComponent},
  { path: 'portada', component: CrudPortadasComponent},
  { path: 'portadas-carreras', component:PortadasComponent },
  { path: 'descuentos', component: DescuentosComponent},
  { path: 'lista-carreras-descuentos', component: ListaCarrerasComponent}
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
