import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  Adjunto,
  Certificado,
  Detalle,
  Imagen,
  Tramite,
  TramiteDoc,
} from "src/app/entities/tramite";
import { ServiciosService } from "src/app/services/servicios.service";
import {
  BsModalService,
  BsModalRef,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { ThisReceiver } from "@angular/compiler";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";

@Component({
  selector: "app-detalletramite",
  templateUrl: "./detalletramite.component.html",
  styleUrls: ["./detalletramite.component.scss"],
})
export class DetalletramiteComponent implements OnInit {
  @Input() in_tramite: TramiteDoc;
  @ViewChild("modalMod") public modalMod: ModalDirective;
  @ViewChild("modalDelete") public modalDelete: ModalDirective;

  detalleForm: FormGroup;
  consultaForm: FormGroup;
  registrarForm: FormGroup;
  estadosActualizarForm: FormGroup;
  uploadForm: FormGroup;

  uploadedFiles: Array<File>;
  listaImagenes: Imagen[];
  listaDetalles: Detalle[];
  listaProductos: Tramite[];
  listaAdjuntos: Adjunto[] = [];
  listaCertificado: Certificado[] = [];
  listaTramiteDoc: TramiteDoc[];
  estadoActualizar: Detalle[] = [];
  detalleEliminar: Detalle;
  certificadoEliminar: Certificado;
  listaTramiteOk: boolean = false;
  modalVisible: boolean = false;
  aceptar: boolean = false;
  imagenOk: boolean;
  adjuntoOk: boolean;
  certificadoOk: boolean;
  optionDelete: number;

  @ViewChild(ToastContainerDirective, { static: true })
  toastContainer: ToastContainerDirective;
  constructor(
    private servicios: ServiciosService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastrService: ToastrService
  ) {}

  // Al inicializar el componente creamos formularios y cargamos nuestras listas
  ngOnInit(): void {
    this.crearFormularios();
    this.detalleTramite();
    this.toastrService.overlayContainer = this.toastContainer;
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
      id_est_doc: new FormControl(),
      estado: new FormControl("", Validators.compose([Validators.required])),
      observaciones: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(255),
      ]),
    });
    this.estadosActualizarForm = this.fb.group({
      id_est_doc: new FormControl(),
      fecha: new FormControl(),
      estado: new FormControl(),
      observaciones: new FormControl("", [
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
    console.log("Seleccionado");
    console.log(detalleSeleccionado.id_est_doc);
    this.modalMod.show();
    this.estadosActualizarForm.controls.id_est_doc.setValue(
      detalleSeleccionado.id_est_doc
    );
    this.estadosActualizarForm.controls.fecha.setValue(
      detalleSeleccionado.fecha
    );
    this.estadosActualizarForm.controls.estado.setValue(
      detalleSeleccionado.estado
    );
    this.estadosActualizarForm.controls.observaciones.setValue(
      detalleSeleccionado.observaciones
    );
  }

  decline(): void {
    this.modalDelete.hide();
    this.aceptar = false;
  }
  confirm(): void {
    this.modalDelete.hide();
    this.aceptar = true;
  }

  eliminarDetalle(values) {
    this.modalDelete.show();
    this.detalleEliminar = values;
    this.optionDelete = 1;
  }
  eliminarCertificado(values: Certificado) {
    this.modalDelete.show();
    this.certificadoEliminar = values;
    this.optionDelete = 2;
  }
  onHideDelete() {
    if (this.aceptar) {
      this.aceptar = false;
      if (this.optionDelete == 1) {
        this.servicios.deleteTramite(this.detalleEliminar).subscribe((res) => {
          console.log("Respuesta eliminar tramite");
          console.log(res);
          this.toastrService.success(
            "Se elimino correctamente el detalle",
            "Exito",
            {
              timeOut: 2000,
            }
          );
          // TODO Validacion
          this.leerDetalles();
        });
      } else if (this.optionDelete == 2) {
        this.servicios
          .deleteCertificado(this.certificadoEliminar)
          .subscribe((res) => {
            //TODO Validacion
            console.log("Resultado Eliminar certificado es ");
            console.log(res);
            this.toastrService.success(
              "Se elimino correctamente el certificado",
              "Exito",
              {
                timeOut: 2000,
              }
            );
            this.leerCertificados();
          });
      }
    }
  }
  detalleTramite() {
    // Asignaciones detalleForm a tramiteSellecionado
    this.detalleForm.controls["detalleTramite"].setValue(
      this.in_tramite.id_est_doc
    );
    this.detalleForm.controls["detalleCodEstudiante"].setValue(
      this.in_tramite.cod_est
    );
    this.detalleForm.controls["detalleApellidos"].setValue(
      this.in_tramite.apellidos
    );
    this.detalleForm.controls["detalleNombres"].setValue(
      this.in_tramite.estudiante
    );
    this.detalleForm.controls["detalleEstado"].setValue(this.in_tramite.estado);
    this.detalleForm.controls["detalleFecha"].setValue(
      this.in_tramite.fecha_doc
    );
    this.llenarListas();
  }

  llenarListas() {
    console.log("this.in_tramite es");
    console.log(this.in_tramite);
    console.log(this.in_tramite.id_est_doc);
    this.leerDetalles();
    this.leerImagenes();
    this.leerAdjuntos();
    this.leerCertificados();
  }

  leerDetalles() {
    this.servicios
      .buscarDetallesD(this.in_tramite.id_est_doc)
      .subscribe((res: Detalle[]) => {
        this.listaDetalles = res;
        console.log(res);
      });
  }

  leerImagenes(): void {
    this.servicios
      .buscarImagenes(this.in_tramite.id_est_doc)
      .subscribe((res: Imagen[]) => {
        // TODO Validacion
        this.listaImagenes = res;
        console.log(res);
        //console.log("esto es imagen" + res[0]["URL"]);
        this.imagenOk = true;
      });
  }

  leerAdjuntos(): void {
    this.servicios
      .buscarAdjuntos(this.in_tramite.id_est_doc)
      .subscribe((res: Adjunto[]) => {
        // TODO Validacion
        this.listaAdjuntos = res;
        console.log(res);
        this.adjuntoOk = true;
      });
  }

  leerCertificados(): void {
    this.servicios
      .buscarCertificado(this.in_tramite.id_est_doc)
      .subscribe((res: Certificado[]) => {
        // TODO Validacion
        this.listaCertificado = res;
        console.log(res);
        this.certificadoOk = true;
      });
  }

  registraEstado(values) {
    values.id_est_doc = this.in_tramite.id_est_doc;
    console.log(values);
    this.servicios.insertarTramite(values).subscribe(
      (res) => {
        console.log("Mensaje es");
        console.log(res);
        if (res.message == "Nuevo Estado Tramite Ingresado") {
          this.toastrService.success(
            "Se registro exitosamente un nuevo estado para " +
              this.in_tramite.id_est_doc,
            "Exito",
            {
              timeOut: 2000,
            }
          );
          this.leerDetalles();
          this.registrarForm.reset(); //borra el contenido del formulario
          this.registrarForm.controls["estado"].setValue("", {
            onlySelf: true,
          });
        } else {
          console.log("Es diferente de exito el registro fallo!!!");
        }
      },
      (error) => {
        console.log("Mensaje Error es ");
        console.log(error);
      }
    );
  }
  //dgqaihqacwkynpyx

  seleccionarArchivo(event) {
    this.uploadedFiles = event.target.files;
  }

  upload() {
    let formData = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
      formData.append(
        "uploads[]",
        this.uploadedFiles[i],
        this.uploadedFiles[i].name
      );
    }
    console.log(formData);
    //TODO Validacion sin subir archivo
    //TODO Se asignar nombre
    this.servicios.uploadFile(formData,this.in_tramite.id_est_doc).subscribe((res) => {
      console.log("response received is ", res);
      // TODO Validacion
      this.toastrService.success(
        "Se subio correctamente certificado para el tramite" +
          this.in_tramite.id_est_doc,
        "Exito",
        {
          timeOut: 2000,
        }
      );
    });
  }

  modificarEstado(values) {
    console.log(values);
    this.servicios.update(values).subscribe((res) => {
   
        this.toastrService.success(
          "Se actualizo correctamente el estado para " +
            this.in_tramite.id_est_doc,
          "Exito",
          {
            timeOut: 2000,
          }
        );
        this.leerDetalles();
        console.log("Res Modificado");
        console.log(res);
        this.modalMod.hide();
    
    });
  }
}
