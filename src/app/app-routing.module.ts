import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrganizadoresComponent } from './organizador/components/organizadores.component';
import { CarreraComponent } from './carrera/components/carrera.component';
import { DistanciasComponent } from './distancia/components/distancias/distancias.component';
import { CorredorComponent } from './corredor/componente/corredor.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { ControlComponent } from './control/componente/control.component';
import { NosotrosComponent } from './home/nosotros/nosotros.component';
import { PublicacionCarreraComponent } from './publicacion-carrera/components/publicacion-carrera.component';
import { PruebaComponent } from './prueba/prueba.component';




const routes: Routes = [
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
  { path: 'prueba', component: PruebaComponent},
  { path: 'nosotros', component: NosotrosComponent },
  
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
