import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DatosIniciales } from '../model/DatosIniciales'



@Component({
  selector: 'app-datos-iniciales',
  templateUrl: './datos-iniciales.component.html',
  styleUrls: ['./datos-iniciales.component.css'],
})
export class DatosInicialesComponent implements OnInit {

  formDatosIniciales = new FormGroup({
    intervalo: new FormControl(),
    tipoGrafica: new FormControl(),
    intervaloDesde: new FormControl(),
    intervaloHasta: new FormControl(),
    puntoEvaluar : new FormControl()

  });
  intervalo: string ;
  tipoGrafica: string;
  intervaloDesde: number;
  intervaloHasta: number;
  puntoEvaluar: number;
  datosIniciales: DatosIniciales = new DatosIniciales;


  constructor(public fb: FormBuilder) { 
    this.formDatosIniciales = this.fb.group({
      intervalo: ['', [Validators.required]],
      tipoGrafica: ['', [Validators.required]],
      intervaloDesde: ['', [Validators.required,Validators.minLength(1),Validators.maxLength(3)]],
      intervaloHasta: ['', [Validators.required,Validators.minLength(1),Validators.maxLength(3)]],
      puntoEvaluar: ['', [Validators.required,Validators.minLength(1),Validators.maxLength(3)]]
    });
  }

  ngOnInit() {
  }

  mostrarData() {
    if(this.validarForm()){
    this.asignarDataToObject()
    alert("datos tomados del form->" + this.datosIniciales.intervalo
      + "->" + this.datosIniciales.tipoGrafica + "->" + this.datosIniciales.intervaloDesde + "->" + this.datosIniciales.intervaloHasta)
    }
  }

  asignarDataToObject(){
    this.datosIniciales.intervalo = this.intervalo;
    this.datosIniciales.intervaloDesde = this.intervaloDesde;
    this.datosIniciales.intervaloHasta = this.intervaloHasta;
    this.datosIniciales.tipoGrafica = this.tipoGrafica;
    this.datosIniciales.puntoEvaluar = this.puntoEvaluar;
  }

  validarForm() {
    if (this.intervaloDesde == this.intervaloHasta) {
      alert("El intervalo inicial("+ this.intervaloDesde +") no puede ser igual al final("+ this.intervaloHasta+")")
      return false
    }else if(this.intervaloDesde > this.intervaloHasta){
      alert("El intervalo inicial("+ this.intervaloDesde +") no puede ser menor al final("+ this.intervaloHasta+")")
      return false
    }else if (!(this.puntoEvaluar>this.intervaloDesde && this.puntoEvaluar<this.intervaloHasta)){
      alert("El punto a evaluar("+this.puntoEvaluar+") no estan dentro del intervalo inicial("+ this.intervaloDesde +") y el intervalo final("+ this.intervaloHasta+")")
      return false
    }
    return true;
  }


}
