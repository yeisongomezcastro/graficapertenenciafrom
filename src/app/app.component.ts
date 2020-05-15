import { Component, ViewChild } from '@angular/core';
import { LineChartComponent } from './line-chart/line-chart.component';
import { DatosIniciales } from './model/DatosIniciales';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-charts-app';
}

let datosInciales : DatosIniciales = new DatosIniciales;
