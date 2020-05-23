import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DatosIniciales } from '../model/DatosIniciales'
import { NgbModal, NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';

 @Component({
  selector: 'app-datos-iniciales',
  templateUrl: './datos-iniciales.component.html',
  styleUrls: ['./datos-iniciales.component.css'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content {
      background-color: #292b2c;
      color: white;
    }
    .dark-modal .close {
      color: white;
    }
    .light-blue-backdrop {
      background-color: #5cb3fd;
    }
  `],
  providers:[NgbTabsetConfig]
})
export class DatosInicialesComponent implements OnInit {
  @Output() datosGrafica = new EventEmitter<DatosIniciales>();

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
  mensajesValidacion : String[];

  datosIniciales: DatosIniciales;

  constructor(public fb: FormBuilder,private modalService: NgbModal) { 
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

  //Modal para mostrar mensajes de validaciones
  openBackDropCustomClass(content) {
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
  }

  //validacion de formulario 
  emitirDatosGrafica(content) {
    if (this.validarFormulario()) {
      //Evento para enviar datos de grafica a componente que grafica
      this.datosGrafica.emit(this.transformarDatosFormulario())      
    }else{
      this.openBackDropCustomClass(content)
    }
  }

  transformarDatosFormulario(): DatosIniciales {
    return {
      intervalo : this.intervalo,
      tipoGrafica : this.tipoGrafica,
      intervaloDesde : this.intervaloDesde,
      intervaloHasta : this.intervaloHasta,
      puntoEvaluar : this.puntoEvaluar
    };
  }

  validarFormulario() {
    this.mensajesValidacion = new Array<string>();
    if (this.intervaloDesde < 0 || this.intervaloHasta < 0) {
      this.mensajesValidacion.push("Solo es permitido valores positivos para definir los intervalos["+ this.intervaloDesde +","+ this.intervaloHasta+"]")
    }if (this.intervaloDesde == this.intervaloHasta) {
      this.mensajesValidacion.push("El intervalo inicial("+ this.intervaloDesde +") no puede ser igual al final("+ this.intervaloHasta+")")
    }if(this.intervaloDesde > this.intervaloHasta){
      this.mensajesValidacion.push("El intervalo inicial("+ this.intervaloDesde +") no puede ser menor al final("+ this.intervaloHasta+")")
    }if (!(this.puntoEvaluar > this.intervaloDesde && this.puntoEvaluar < this.intervaloHasta)){
      this.mensajesValidacion.push("El punto a evaluar["+this.puntoEvaluar+"] no estan dentro del intervalo ["+ this.intervaloDesde +","+ this.intervaloHasta+"]")
    }
    let valorCercania = this.getValorCercanidad()
    if ((this.puntoEvaluar-this.intervaloDesde)<valorCercania) {
      this.mensajesValidacion.push("El intervalo inicial debe ser minimo "+ valorCercania  +" unidades menor al punto a evaluar")
    }
    if ((this.intervaloHasta - this.puntoEvaluar)<valorCercania) {
      this.mensajesValidacion.push("El intervalo final debe ser minimo "+ valorCercania  +" unidades mayor al punto a evaluar")
    }
    return this.mensajesValidacion.length>0 ? false : true;
  }

  getValorCercanidad() {
    if (this.intervalo == "Discreto") {
      switch (this.tipoGrafica) {
        case "Muy Cerca": return 1;
        case "Cerca": return 2;
        case "Lejos": return 5;
        case "Muy Lejos": return 10;
      }
    } else {
      switch (this.tipoGrafica) {
        case "Muy Cerca": return 4;
        case "Cerca": return 2;
        case "Lejos": return 2;
        case "Muy Lejos": return 4;
      }
    }
  }


}
