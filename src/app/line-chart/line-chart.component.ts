import { Component, Input, } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color } from 'ng2-charts';
import { DatosIniciales } from '../model/DatosIniciales';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})

export class LineChartComponent {
  @Input() datosIniciales: DatosIniciales;

  ngOnInit() {  
    console.log(this.datosIniciales);
    this.resetData();
    this.generarGrafica(this.getValorCercanidad());
  }

  ngOnChanges(){
    this.resetData()
    this.generarGrafica(this.getValorCercanidad())
  }  

  lineChartData: ChartDataSets[]
  data = new Array<number>()
  lineChartLabels = new Array<number>();
  fnEvaluada : string = ""

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: [
        'rgba(0, 99, 132, 0.6)',
        'rgba(30, 99, 132, 0.6)',
        'rgba(60, 99, 132, 0.6)',
        'rgba(90, 99, 132, 0.6)',
        'rgba(120, 99, 132, 0.6)',
        'rgba(150, 99, 132, 0.6)',
        'rgba(180, 99, 132, 0.6)',
        'rgba(210, 99, 132, 0.6)',
        'rgba(240, 99, 132, 0.6)'
      ],
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  funcionContinuaCercaMuyCerca(valorCercanidad: number, x: number, puntoAcercamiento: number) {
    this.fnEvaluada = "1 / (1 + ("+puntoAcercamiento+" - x)^"+valorCercanidad+")"
    return 1 / (1 + Math.pow((puntoAcercamiento - x), valorCercanidad));
  }

  funcionContinuaLejosMuyLejos(valorCercanidad: number, x: number, puntoAcercamiento: number) {
    this.fnEvaluada = "1 /(1+(("+puntoAcercamiento+"-x)^2/"+valorCercanidad+"))"
    return 1 /(1+((Math.pow((puntoAcercamiento-x),2)/valorCercanidad)));
  }


  funcionPendiente(x: number, puntoAcercamiento: number, unidades: number) {
    let puntoPendientePositiva = puntoAcercamiento-unidades
    let puntoFinalPendienteNegativa = puntoAcercamiento + unidades
    let diferenciaPtoAcerPtoPdtPos  = puntoAcercamiento - puntoPendientePositiva
    this.fnEvaluada = "0 si x entre ["+this.datosIniciales.intervaloDesde+","+puntoPendientePositiva+"]U["+puntoFinalPendienteNegativa+","+this.datosIniciales.intervaloHasta+"]"+
    "\n ; (x-"+puntoPendientePositiva+")/" + diferenciaPtoAcerPtoPdtPos + " si x entre["+puntoPendientePositiva+","+puntoAcercamiento+"]"+
    "\n ; ("+puntoFinalPendienteNegativa+"-x)/"+diferenciaPtoAcerPtoPdtPos+" si x entre["+puntoAcercamiento+","+puntoFinalPendienteNegativa+"]"
    if(x<puntoPendientePositiva) return 0
    //Evaluacion de pendiente positiva
    if (x >= puntoPendientePositiva && x < puntoAcercamiento) {
      return (x-puntoPendientePositiva) / (puntoAcercamiento - puntoPendientePositiva)
    } else if(x <= puntoFinalPendienteNegativa) {
      //Pendiente negativa
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
    //Generacion de puntos en el eje x para evaluacion en la fn
    while (temp <= this.datosIniciales.intervaloHasta) {
      this.lineChartLabels.push(temp);
      temp += 2;
    }
    if(this.datosIniciales.tipoGrafica=="Lejos" || this.datosIniciales.tipoGrafica=="Muy Lejos"){
      for (let index = 0; index < this.lineChartLabels.length; index++) {
        //evaluacion de puntos x para sacar valor y
        this.data.push(this.funcionContinuaLejosMuyLejos(valorCercanidad,this.lineChartLabels[index], this.datosIniciales.puntoEvaluar));
      }
    }else{
      for (let index = 0; index < this.lineChartLabels.length; index++) {
        //evaluacion de puntos x para sacar valor y
        this.data.push(this.funcionContinuaCercaMuyCerca(valorCercanidad,this.lineChartLabels[index], this.datosIniciales.puntoEvaluar));
      }
    }
    this.lineChartData = [
      { data: this.data, label: 'Continuo' },
    ]
    console.log(this.lineChartLabels)
    console.log(this.data)
  }

  graficaDiscreta(valorCercanidad: number) {
    let temp = this.datosIniciales.intervaloDesde;
    //Generacion de puntos en el eje x para evaluacion en la fn
    while (temp <= this.datosIniciales.intervaloHasta) {
      //Generacion de puntos en el eje x para evaluacion en la fn
      this.lineChartLabels.push(temp);
      temp += 1;
    }
    for (let index = 0; index < this.lineChartLabels.length; index++) {
      //evaluacion de puntos x para sacar valor y
      this.data.push(this.funcionPendiente(this.lineChartLabels[index], this.datosIniciales.puntoEvaluar, valorCercanidad));
    }
    this.lineChartData = [
      { data: this.data, label: 'Discreta' },
    ]
    console.log(this.lineChartLabels)
    console.log(this.data)
  }

  //fn para obtener el valor de cercania segun el tipo de grafica y el intervalo
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

  //fn para reset de data de grafica 
  resetData(){
    this.lineChartData =[];
    this.data = new Array<number>();
    this.lineChartLabels = new Array<number>();
  }

}