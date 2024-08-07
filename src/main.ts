import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing.module'; // Asegúrate de ajustar la ruta según sea necesario
import { AuthInterceptor } from './app/servicios/authIn-terceptor';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule), // Asegúrate de importar HttpClientModule
    provideRouter(routes), // Provee las rutas de tu aplicación
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // Provee el interceptor
  ]
}).catch(err => console.error(err));
