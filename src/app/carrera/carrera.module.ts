import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CarreraComponent } from './components/carrera.component';
import { FormCarreraComponent } from './components/form-carrera/form-carrera.component';

const routes: Routes = [
  { path: 'carreras', component: CarreraComponent }
];

@NgModule({
  declarations: [
    FormCarreraComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class CarreraModule { }
