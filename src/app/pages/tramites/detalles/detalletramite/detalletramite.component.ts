import { Component, Input, OnInit, ViewChild } from "@angular/core";
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
  TramiteDoc,
} from "src/app/entities/tramite";
import { ServiciosService } from "src/app/services/servicios.service";
import {
  BsModalService,
  BsModalRef,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { Observable, ReplaySubject } from "rxjs";
import { Buffer } from "buffer";
@Component({
  selector: "app-detalletramite",
  templateUrl: "./detalletramite.component.html",
  styleUrls: ["./detalletramite.component.scss"],
})
export class DetalletramiteComponent implements OnInit {
  // Parametro de entrada que viene apartir del componente padre tramitesComponent
  @Input() in_tramite: TramiteDoc;
  // Declaramos nuestro de edit de tramite
  @ViewChild("modalMod") public modalMod: ModalDirective;

  // Declaramos nuestros FormGroup
  detalleForm: FormGroup;
  consultaForm: FormGroup;
  registrarForm: FormGroup;
  estadosActualizarForm: FormGroup;
  uploadForm: FormGroup;
  // Declaramos nuestro arreglo de archivos para la subida de certificados
  uploadedFiles: Array<File>;
  // Declaramos arreglos de tramites
  listaImagenes: Imagen[];
  listaDetalles: Detalle[];
  listaAdjuntos: Adjunto[] = [];
  listaCertificado: Certificado[] = [];
  listaTramiteDoc: TramiteDoc[];
  estadoActualizar: Detalle[] = [];
  // Declaramos nuestras entidades
  detalleEliminar: Detalle;
  certificadoEliminar: Certificado;
  // Validaciones booleanas para mostrar la tabla segun se requiera
  listaTramiteOk: boolean = false;
  modalVisible: boolean = false;
  aceptar: boolean = false;
  imagenOk: boolean = false;
  adjuntoOk: boolean = false;
  certificadoOk: boolean = false;
  // Variable que determina que registro se elimina ( Un detalle Tramite o un Certificado)
  optionDelete: number;
  // Variable que obtiene la base64
  base64Output: string;
  // Nombre inicializado del label de seleccion de archivos para subir certificado
  fileName: string = "Seleccione un archivo (PDF)";
  // Instanciamos nuestro Toast
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

  // Creacion de nuestros reactiveForms con sus respectivas validaciones
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
      subir: new FormControl(null, [Validators.required]),
    });
  }

  // Detecta cambio en la variable Input para cargar nuevo tramite seleccionado
  ngOnChanges() {
    this.crearFormularios();
    this.detalleTramite();
  }


  // Metodo que toma el detalle seleccionado y muestra el modar de modificacion para editar
  seleccionarDetalle(detalleSeleccionado) {
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

  // Metodo para eliminar detalle
  eliminarDetalle(values) {
    this.detalleEliminar = values;
    this.optionDelete = 1;
    this.alertEliminar();
  }

  // Metodo para eliminar certificado
  eliminarCertificado(values: Certificado) {
    this.certificadoEliminar = values;
    console.log("Objeto Eliminar Values", this.certificadoEliminar);
    this.optionDelete = 2;
    this.alertEliminar();
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
    this.leerDetalles();
    this.leerImagenes();
    this.leerAdjuntos();
    this.leerCertificados();
  }

  // Metodo que llama el detalle del tramite seleccionado
  leerDetalles() {
    this.servicios.buscarDetallesD(this.in_tramite.id_est_doc).subscribe({
      next: (res: Detalle[]) => {
        this.listaDetalles = res;
      },
      error: (err) => {
        console.log("leerDetalles error ", err);
        this.toastrService.error(err, "Error", {
          timeOut: 5000,
        });
      },
    });
  }

  // Metodo que llama las imagenes tramite seleccionado
  leerImagenes(): void {
    this.servicios.buscarImagenes(this.in_tramite.id_est_doc).subscribe({
      next: (res: Imagen[]) => {
        this.listaImagenes = res;
        this.imagenOk = true;
      },
      error: (err) => {
        console.log("leerImagenes error ", err);
        this.toastrService.error(err, "Error", {
          timeOut: 5000,
        });
      },
    });
  }

  // Metodo que llama los adjuntos tramite seleccionado
  leerAdjuntos(): void {
    this.servicios.buscarAdjuntos(this.in_tramite.id_est_doc).subscribe({
      next: (res: Adjunto[]) => {
        this.listaAdjuntos = res;
        this.adjuntoOk = true;
      },
      error: (err) => {
        console.log("leerAdjuntos Error ", err);
        this.toastrService.error(err, "Error", {
          timeOut: 3000,
        });
      },
    });
  }

  // Metodo que llama los certificados tramite seleccionado
  leerCertificados(): void {
    this.servicios.buscarCertificado(this.in_tramite.id_est_doc).subscribe({
      next: (res: Certificado[]) => {
        this.listaCertificado = res;
        this.certificadoOk = true;
      },
      error: (err) => {
        console.log("leerCertificados Error ", err);
        this.toastrService.error(err, "Error", {
          timeOut: 5000,
        });
      },
    });
  }

  // Metodo para registrar nuestro detalle del tramite seleccionado
  registraEstado(values) {
    values.id_est_doc = this.in_tramite.id_est_doc;
    this.servicios.insertarTramite(values).subscribe({
      next: (res) => {
        switch (res.message) {
          case "Nuevo Estado Tramite Ingresado":
            this.toastrService.success(
              "Se registro exitosamente un nuevo estado para " +
                this.in_tramite.id_est_doc,
              "Exito",
              {
                timeOut: 2000,
              }
            );
            this.leerDetalles();
            this.registrarForm.reset();
            this.registrarForm.controls["estado"].setValue("", {
              onlySelf: true,
            });
            break;
          default:
            this.toastrService.error(res.message, "Error", {
              timeOut: 3000,
            });
            break;
        }
      },
      error: (err) => {
        console.log("regisraEstado error", err);
        this.toastrService.error(err, "Error", {
          timeOut: 5000,
        });
      },
    });
  }
  //dgqaihqacwkynpyx
  // Metodo para seleccionar archivo a subir como certificado
  seleccionarArchivo(event) {
    // Validamos que sea diferente de undefined
    if (typeof event.target.files[0] !== "undefined") {
      this.convertFile(event.target.files[0]).subscribe((base64) => {
        this.fileName = event.target.files[0].name;
        this.uploadForm.controls.subir.setValue(base64);
      });
    }
  }

  // Metodo para convertir a base64 el archivo seleccionado
  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
     result.next(
        Buffer.from(event.target.result.toString(), "binary").toString("base64")
      );
    };
    return result;
  }

  // Metodo para enviar la base64 e ID del tramite al servicio y subirlo
  upload() {
    const values = {
      id: this.in_tramite.id_est_doc,
      base64: this.uploadForm.getRawValue().subir,
    };
    this.servicios.uploadFile(values).subscribe({
      next: (res) => {
        switch (res.message) {
          case "Certificado registrado existosamente":
            this.uploadForm.reset();
            this.fileName = "Seleccione un archivo (PDF)";
            this.toastrService.success(
              "Se subio correctamente certificado para el tramite" +
                this.in_tramite.id_est_doc,
              "Exito",
              {
                timeOut: 3000,
              }
            );
            this.leerCertificados();
            break;
          default:
            this.toastrService.error(res.message, "Error", {
              timeOut: 3000,
            });
            break;
        }
      },
      error: (err) => {
        console.log("upload error ", err);
        this.toastrService.error(err, "Error", {
          timeOut: 5000,
        });
      },
    });
  }

  // Metodo utilizado al editar el estado y/o observaciones de un estado del tramite seleccionado
  modificarEstado(values) {
    this.servicios.update(values).subscribe({
      next: (res) => {
        switch (res.message) {
          case "Tramite actualizado":
            this.toastrService.success(
              "Se actualizo correctamente el estado para " +
                this.in_tramite.id_est_doc,
              "Exito",
              {
                timeOut: 3000,
              }
            );
            this.leerDetalles();
            this.modalMod.hide();
            break;
          default:
            this.toastrService.error(res.message, "Error", {
              timeOut: 3000,
            });
            break;
        }
      },
      error: (err) => {
        console.log("modificarEstado Error ", err);
        this.toastrService.error(err, "Error", {
          timeOut: 5000,
        });
      },
    });
  }

  // Llamada al servicio para eliminar detalleTramite
  callServicedeleteDetalleTramite(): void {
    this.servicios.deleteTramite(this.detalleEliminar).subscribe({
      next: (res) => {
        switch (res.message) {
          case "Tramite eliminado":
            this.toastrService.success(
              "Se elimino correctamente el detalle",
              "Exito",
              {
                timeOut: 3000,
              }
            );
            this.leerDetalles();
            break;
          default:
            this.toastrService.error(res.message, "Error", {
              timeOut: 3000,
            });
            break;
        }
      },
      error: (err) => {
        console.log("delete tramite ", err);
        this.toastrService.error(err, "Error", {
          timeOut: 5000,
        });
      },
    });
  }

  // Llamada al servicio apra eliminar el certificado de un tramite
  callServiceDeleteCertificado(): void {
    this.servicios.deleteCertificado(this.certificadoEliminar).subscribe({
      next: (res) => {
        switch (res.message) {
          case "Certicado eliminado":
            this.toastrService.success(
              "Se elimino correctamente el certificado",
              "Exito",
              {
                timeOut: 3000,
              }
            );
            this.leerCertificados();
            break;
          default:
            this.toastrService.error(res.message, "Error", {
              timeOut: 3000,
            });
            break;
        }
      },
      error: (err) => {
        console.log("deleteCertificado error", err);
        this.toastrService.error(err, "Error", {
          timeOut: 5000,
        });
      },
    });
  }

  // Alerta de advertencia al eliminar un registro (DetalleTramite o Certificado)
  alertEliminar() {
    Swal.fire({
      title: "¿Estas seguro de eliminar este registro?",
      text: "Esta acción no puede revertirse",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Segun la opcion elegida (1=detalleTramite o 2=Certificado) se elimina el registro correspondiente
        // Caso default en caso se tenga un valor desconocido
        switch (this.optionDelete) {
          case 1:
            this.callServicedeleteDetalleTramite();
            break;
          case 2:
            this.callServiceDeleteCertificado();
            break;
          default:
            this.toastrService.error(
              "Sucedio un error eliminar registro",
              "Error",
              {
                timeOut: 5000,
              }
            );
            break;
        }
        Swal.fire("Elimado!", "El registro fue eliminado con exito", "success");
      }
    });
  }
}
