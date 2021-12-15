import { Component, Input, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { Adjunto, Certificado, Detalle, Imagen, Tramite, TramiteDoc } from "src/app/entities/tramite";
import { ServiciosService } from "src/app/services/servicios.service";
import { BsModalService, BsModalRef, ModalDirective } from "ngx-bootstrap/modal";
import * as moment from "moment";
import { of } from 'rxjs';
import { SpinnerService } from "src/app/services/spinner.service";
@Component({
  selector: "app-detalletramite",
  templateUrl: "./detalletramite.component.html",
  styleUrls: ["./detalletramite.component.scss"],
})

export class DetalletramiteComponent implements OnInit {
  @Input() in_tramite: TramiteDoc;
  detalleForm: FormGroup;


  consultaForm: FormGroup;
  registrarForm: FormGroup;
  estadosActualizarForm: FormGroup;
  uploadForm: FormGroup;
  listaTramiteDoc: TramiteDoc[];
  listaTramiteOk = false;
  modalVisible = false;

  mensajeError: String;
  estadoActualizar: Detalle[] = [];
  currentDate: number = Date.now();

  nuevoEstado: any = {};
  imagen: any;
  adjunto: any;
  certificado: any;
  listaImagenes: Imagen[];
  listaDetalles: Detalle[];
  listaProductos: Tramite[];
  listaAdjuntos: Adjunto[] = [];
  listaCertificado: Certificado[] = [];
  archivo = {
    nombreArchivo: null,
    base64textString: null,
    id: null,
  };

  @ViewChild(ModalDirective, { static: false }) modalMod: ModalDirective;

  constructor(
    private servicios: ServiciosService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private spinnerService: SpinnerService
  ) { }

  // Al inicializar el componente creamos formularios y cargamos nuestras listas
  ngOnInit(): void {
    console.log('Input Tramite Seleccionado');
    console.log(this.in_tramite);
    this.crearFormularios();
    console.log('antes de detalleTramite componente modal');
    this.detalleTramite();
  }

  crearFormularios() {
    this.detalleForm = this.fb.group({
      detalleTramite: new FormControl(""),
      detalleCodEstudiante: new FormControl(""),
      detalleApellidos: new FormControl(""),
      detalleNombres: new FormControl(""),
      detalleEstado: new FormControl(""),
      detalleFecha: new FormControl(""),
    });
    this.registrarForm = this.fb.group({
      ID_EST_DOC: new FormControl(),
      ESTADO: new FormControl("", Validators.compose([
        Validators.required
      ])),
      OBSERVACIONES: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(105),
      ]),
    });
    this.estadosActualizarForm = this.fb.group({
      ID_EST_DOC: new FormControl(),
      FECHA: new FormControl(),
      ESTADO: new FormControl(),
      OBSERVACIONES: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
      ]),
    });
    this.detalleForm = this.fb.group({
      detalleTramite: new FormControl(""),
      detalleCodEstudiante: new FormControl(""),
      detalleApellidos: new FormControl(""),
      detalleNombres: new FormControl(""),
      detalleEstado: new FormControl(""),
      detalleFecha: new FormControl(""),
    });
    this.uploadForm = new FormGroup({
      subir: new FormControl(),
    });
  }
  // Detecta cambio en la variable Input para cargar nuevo tramite seleccionado
  ngOnChanges() {
    this.crearFormularios();
    this.detalleTramite();
  }

  seleccionarDetalle(detalleSeleccionado) {
    this.modalMod.show();
    this.estadosActualizarForm.controls["ID_EST_DOC"].setValue(
      detalleSeleccionado.ID_EST_DOC
    );
    this.estadosActualizarForm.controls["FECHA"].setValue(
      detalleSeleccionado.FECHA
    );
    this.estadosActualizarForm.controls["ESTADO"].setValue(
      detalleSeleccionado.ESTADO
    );
    this.estadosActualizarForm.controls["OBSERVACIONES"].setValue(
      detalleSeleccionado.OBSERVACIONES
    );
    console.log("Seleccionado0 detalleSeleccionado");
    console.log(detalleSeleccionado);
  }

  detalleTramite() {

    console.log("Tramite Detalle Seleccionado es Input");
    console.log(this.in_tramite);
    // Asignaciones detalleForm a tramiteSellecionado
    this.detalleForm.controls["detalleTramite"].setValue(
      this.in_tramite.ID_EST_DOC
    );
    this.detalleForm.controls["detalleCodEstudiante"].setValue(
      this.in_tramite.COD_EST
    );
    this.detalleForm.controls["detalleApellidos"].setValue(
      this.in_tramite.APELLIDOS
    );
    this.detalleForm.controls["detalleNombres"].setValue(
      this.in_tramite.ESTUDIANTE
    );
    this.detalleForm.controls["detalleEstado"].setValue(
      this.in_tramite.ESTADO
    );
    this.detalleForm.controls["detalleFecha"].setValue(
      this.in_tramite.FECHA_DOC
    );
    this.llenarListas();
  }

  llenarListas() {
    this.in_tramite = this.in_tramite;
    this.leerDetalles(this.in_tramite.ID_EST_DOC);
    this.leerImagenes(this.in_tramite.ID_EST_DOC);
    this.leerAdjuntos(this.in_tramite.ID_EST_DOC);
    this.leerCertificados(this.in_tramite.ID_EST_DOC);
  }

  leerDetalles(ID_EST_DOC) {
    this.in_tramite = this.in_tramite;
    ID_EST_DOC = this.in_tramite["ID_EST_DOC"];
    this.servicios.buscarDetallesD(ID_EST_DOC).subscribe((res: Detalle[]) => {
      this.listaDetalles = res;
      console.log("PRUEBA RES ESTADO DETALLES" + res["OBSERVACIONES"]);
    });
  }

  leerImagenes(ID_EST_DOC): void {
    this.servicios.buscarImagenes(ID_EST_DOC).subscribe((res: Imagen[]) => {
      if (res["mensaje"] == "FALLO") {
        res = null;
        console.log("RES LISTA IMAGEN ES NULL");
        this.imagen = false;
      } else {
        this.listaImagenes = res;
        console.log(res);
        console.log("esto es imagen" + res[0]["URL"]);
        this.imagen = true;
      }
    });
  }

  leerAdjuntos(ID_EST_DOC): void {
    this.servicios.buscarAdjuntos(ID_EST_DOC).subscribe((res: Adjunto[]) => {
      if (res["mensaje"] == "FALLO") {
        res = null;
        console.log("RES LISTA ADJUNTO ES NULL");
        this.adjunto = false;
      } else {
        this.listaAdjuntos = res;
        console.log(res);
        this.adjunto = true;
      }
    });
  }

  leerCertificados(ID_EST_DOC): void {
    this.servicios
      .buscarCertificado(ID_EST_DOC)
      .subscribe((res: Certificado[]) => {
        if (res["mensaje"] == "FALLO") {
          res = null;
          console.log("RES LISTA CERTIFICADO ES NULL");
          this.certificado = false;
        } else {
          this.listaCertificado = res;
          console.log(res);
          this.certificado = true;
        }
      });
  }

  registraEstado(values) {
    //   values.ID_EST_DOC = this.in_tramite.ID_EST_DOC;
    console.log(values);

    const v = moment().format("Y-M-D, h:mm:ss");
    /*  if (values.ESTADO === null) {
        console.log("esto es null no registrar");
        //    $("#NuevoEstadoNull").fadeIn();
        //   $("#NuevoEstadoNull").fadeOut(4500);
      } else {
        console.log("no es null");*/
    this.servicios.insertarTramite(this.in_tramite.ID_EST_DOC, values.ESTADO, values.OBSERVACIONES).subscribe(
      (res) => {
        console.log('Response INSERTAR TRAMITE')
        console.log(res);
        console.log(" fecha es v " + v);
        this.nuevoEstado = {
          ID_EST_DOC: this.in_tramite.ID_EST_DOC,
          FECHA: v,
          ESTADO: values.ESTADO,
          OBSERVACIONES: values.OBSERVACIONES,
        };
        console.log("ListaDetalles blanco");
        this.listaDetalles.push(this.nuevoEstado); // Agrega una nueva fila en la vista
        console.log(
          "Lista detalles con algo dentro " +
          this.listaDetalles[0]["ID_EST_DOC"]
        );

        this.registrarForm.reset(); //borra el contenido del formulario
        this.registrarForm.controls['ESTADO'].setValue("", {onlySelf: true});

      },
      (error) => {
        console.log('Mensaje Error es ')
        console.log(error)
      }

    );


  }

  seleccionarArchivo(event) {
    var files = event.target.files;
    var file = files[0];
    this.archivo.nombreArchivo = file.name;
    this.archivo.id = this.in_tramite.ID_EST_DOC;

    if (files && file) {
      var reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  _handleReaderLoaded(readerEvent) {
    var binaryString = readerEvent.target.result;
    this.archivo.base64textString = btoa(binaryString);
  }

  upload() {
    console.log(this.archivo);

    if (this.archivo.base64textString == null) {
      alert("No hay archivo adjunto")
      //    $("#SubidaNull").fadeIn();
      //     $("#SubidaNull").fadeOut(4500)
    } else {
      //   $("#modal_carga").modal('show');
      this.servicios.uploadFile(this.archivo).subscribe((datos) => {
        if (
          datos["mensaje"] == "EXITO" &&
          this.archivo.base64textString !== null
        ) {
          //  alert("Se subio certificado de manera exitosa");
          console.log(this.archivo.id + " response" + datos["iden"]);
          this.archivo.base64textString = null;
          this.archivo.nombreArchivo = null;
          this.archivo.id = null;
          //   $("#SubidaOk").fadeIn();
          //   $("#SubidaOk").fadeOut(4500)
          this.uploadForm.reset();
          //   this.notificacion();
          this.leerCertificados(this.in_tramite.ID_EST_DOC);
          //   $("#modal_carga").modal('hide');
        } else {
          alert("No hay archivo adjunto")
          //  $("#SubidaError").fadeIn();
          //    $("#SubidaError").fadeOut(4500)
          //    $("#modal_carga").modal('hide');
        }
      });
    }
  }

  modificarEstado(values) {
    console.log(values);
    this.servicios.estadoUpdate(
      values.ID_EST_DOC, values.OBSERVACIONES, values.FECHA, values.ESTADO).subscribe();
    alert("Se ha actualizado el tramite : " + this.in_tramite.ID_EST_DOC);
    // $('#formulario-actualizar').modal('hide');
    //  $('#ModificaEstado').fadeIn();
    // $('#ModificaEstado').fadeOut(4500);


    this.leerDetalles(this.in_tramite.ID_EST_DOC);
     this.modalMod.hide();
  }

}
