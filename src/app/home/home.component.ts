import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PublicacionCarreraComponent } from '../publicacion-carrera/components/publicacion-carrera.component';
import { NosotrosComponent } from './nosotros/nosotros.component';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, PublicacionCarreraComponent, NosotrosComponent ]
})
export class HomeComponent implements OnInit, AfterViewInit  {


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
 
  }
}
