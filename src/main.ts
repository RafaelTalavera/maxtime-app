import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { Component, importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HomeComponent } from './app/home/home.component';
import { OrganizadoresComponent } from './app/organizador/components/organizadores.component';
import { CarreraComponent } from './app/carrera/components/carrera.component';
import { DistanciasComponent } from './app/distancia/components/distancias/distancias.component';
import { PublicacionCarreraComponent } from './app/publicacion-carrera/components/publicacion-carrera.component';
import { CorredorComponent } from './app/corredor/componente/corredor.component';
import { LoginComponent } from './app/login/login.component';
import { MenuComponent } from './app/menu/menu.component';
import { ControlComponent } from './app/control/componente/control.component';
import { NosotrosComponent } from './app/home/nosotros/nosotros.component';
import { AuthInterceptor } from './app/servicios/authIn-terceptor';

import { ResultsComponent } from './app/upload-results/upload-results.component';

const routes = [
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
  { path: 'carga', component: ResultsComponent}
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
}).catch(err => console.error(err));
