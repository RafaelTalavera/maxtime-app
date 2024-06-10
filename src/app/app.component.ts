import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CarreraListComponent } from './publicacion-carrea/components/publicacion-carrea.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [
        CommonModule,
        RouterOutlet,
        RouterModule,
        HomeComponent,
        NavbarComponent,
        NgxMaterialTimepickerModule, 
        CarreraListComponent,
    ]
})
export class AppComponent {
  title = 'maxtime-app';
}
