import { Component, Input } from '@angular/core';

import { DatosIniciales } from './model/DatosIniciales';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'angular-charts-app';
  datosGrafica : DatosIniciales;
  mostrarGrafica = false;

  obtenerDatosGrafica(e) {
    this.datosGrafica = e;
    this.mostrarGrafica = true;
  }  
}

