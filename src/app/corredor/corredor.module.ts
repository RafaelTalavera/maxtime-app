import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CorredorComponent } from './componente/corredor.component';
import { FormCorredorComponent } from './componente/form-corredor.component';

const routes: Routes = [
  { path: 'inscripcion', component: CorredorComponent }
];

@NgModule({
  declarations: [

    FormCorredorComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class CorredorModule { }
