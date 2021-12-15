import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Adjunto, Certificado, Detalle, Imagen, Tramite, TramiteDoc } from 'src/app/entities/tramite';
import { ServiciosService } from 'src/app/services/servicios.service';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-tramites',
  templateUrl: './tramites.component.html',
  styleUrls: ['./tables.component.scss']
})
export class tramitesComponent implements OnInit {
  consultaForm: FormGroup;

  registrarForm : FormGroup;
  estadosActualizarForm : FormGroup;
  uploadForm: FormGroup;
  listaTramiteDoc: TramiteDoc[];
  listaTramiteOk=false;
  modalVisible=false;
  tramiteSeleccionado: TramiteDoc;

  @ViewChild(ModalDirective, { static: false }) modal: ModalDirective;
  constructor(private servicios: ServiciosService,private fb: FormBuilder,private modalService: BsModalService,private spinnerService: SpinnerService) { }

  
  ngOnInit() {
    this.consultaForm = this.fb.group({
      filterTramite: new FormControl(''),
      filterCodEstudiante : new FormControl(''),
      filterApellidos : new FormControl(''),
      filterNombres : new FormControl(''),
      filterEstado : new FormControl(''),
      filterFecha : new FormControl(''),
      filterTipoTramite : new FormControl(''),
    });
    this.listarTramiteDoc();
  }




  listarTramiteDoc():void{
    this.servicios.listaTramites().subscribe(
      (res:TramiteDoc[])=>{
        this.listaTramiteDoc=res;
        console.log('Lista tramites ');
        console.log(this.listaTramiteDoc);
        this.listaTramiteOk=true;
      }
    )
  }


  detalleTramite(tramite: TramiteDoc) {
    this.tramiteSeleccionado = tramite;
    console.log(this.tramiteSeleccionado);
    this.modal.show();
    this.modalVisible = true;
  }






}

