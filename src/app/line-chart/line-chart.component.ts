import { Component, Input, } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';
import { DatosIniciales } from '../model/DatosIniciales';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent {

  @Input() datosIniciales: DatosIniciales = new DatosIniciales;

  ngOnInit() {
    this.datosIniciales.intervalo = "Continua"
    this.datosIniciales.intervaloDesde = 0
    this.datosIniciales.intervaloHasta = 10
    this.datosIniciales.puntoEvaluar = 4
    this.datosIniciales.tipoGrafica = "Cerca"
    this.generarGrafica(this.getValorCercanidad());
  }

  lineChartData: ChartDataSets[]
  //= [
  //{ data: [0, 1, 0.9, 0.7, 0.5, 0.3, 0.1,0,0,0,0,0], label: 'Discreto' },
  //];

  data = new Array<number>()
  //lineChartLabels: Label[] = ['1', '2', '3', '4', '5', '6','7','9','10','11','12'];
  lineChartLabels = new Array<number>();

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  funcionContinua(valor: number, punto: number, valorAcerca: number) {
    return 1 / (1 + Math.pow((valor - punto), valorAcerca));
  }

  funcionPendiente(x: number, puntoAcercamiento: number, unidades: number) {
    let puntoPendientePositiva = puntoAcercamiento-unidades
    let puntoFinalPendienteNegativa = puntoAcercamiento + unidades
    if(x<puntoPendientePositiva) return 0
    //evaluacion de pendiente positiva
    if (x >= puntoPendientePositiva && x < puntoAcercamiento) {
      return (x-puntoPendientePositiva) / (puntoAcercamiento - puntoPendientePositiva)
    } else if(x <= puntoFinalPendienteNegativa) {
      return (puntoFinalPendienteNegativa - x) / (puntoAcercamiento - puntoPendientePositiva)
    }else{
      return 0
    }
  }

  generarGrafica(valorCercanidad: number) {
    if (this.datosIniciales.intervalo == "Continuo") {
      this.graficaContinua(valorCercanidad)
    } else {
      this.graficaDiscreta(valorCercanidad)
    }

  }

  graficaContinua(valorCercanidad: number) {
    let temp = this.datosIniciales.intervaloDesde;
    while (temp <= this.datosIniciales.intervaloHasta) {
      this.lineChartLabels.push(temp);
      temp += 2;
    }
    for (let index = 0; index < this.lineChartLabels.length; index++) {
      this.data.push(this.funcionContinua(this.lineChartLabels[index], this.datosIniciales.puntoEvaluar, valorCercanidad));
    }
    this.lineChartData = [
      { data: this.data, label: 'Continuo' },
    ]
    console.log(this.lineChartLabels)
    console.log(this.data)
  }

  graficaDiscreta(valorCercanidad: number) {
    let temp = this.datosIniciales.intervaloDesde;
    while (temp <= this.datosIniciales.intervaloHasta) {
      this.lineChartLabels.push(temp);
      temp += 1;
    }
    for (let index = 0; index < this.lineChartLabels.length; index++) {
      this.data.push(this.funcionPendiente(this.lineChartLabels[index], this.datosIniciales.puntoEvaluar, valorCercanidad));
    }
    this.lineChartData = [
      { data: this.data, label: 'Discreta' },
    ]
    console.log(this.lineChartLabels)
    console.log(this.data)
  }

  getValorCercanidad() {
    if (this.datosIniciales.intervalo == "Discreto") {
      switch (this.datosIniciales.tipoGrafica) {
        case "Muy Cerca": return 1;
        case "Cerca": return 2;
        case "Lejos": return 5;
        case "Muy Lejos": return 10;
      }
    } else {
      switch (this.datosIniciales.tipoGrafica) {
        case "Muy Cerca": return 4;
        case "Cerca": return 2;
        case "Lejos": return 2;
        case "Muy Lejos": return 4;
      }
    }

  }

}