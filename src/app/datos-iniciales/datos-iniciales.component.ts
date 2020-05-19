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

  openBackDropCustomClass(content) {
    this.modalService.open(content, {backdropClass: 'light-blue-backdrop'});
  }

  emitirDatosGrafica(content) {
    if (this.validarFormulario()) {
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
    if (this.intervaloDesde == this.intervaloHasta) {
      this.mensajesValidacion.push("El intervalo inicial("+ this.intervaloDesde +") no puede ser igual al final("+ this.intervaloHasta+")")
    }if(this.intervaloDesde > this.intervaloHasta){
      this.mensajesValidacion.push("El intervalo inicial("+ this.intervaloDesde +") no puede ser menor al final("+ this.intervaloHasta+")")
    }if (!(this.puntoEvaluar > this.intervaloDesde && this.puntoEvaluar < this.intervaloHasta)){
      this.mensajesValidacion.push("El punto a evaluar["+this.puntoEvaluar+"] no estan dentro del intervalo ["+ this.intervaloDesde +","+ this.intervaloHasta+"]")
    }
    return this.mensajesValidacion.length>0 ? false : true;
  }


}
