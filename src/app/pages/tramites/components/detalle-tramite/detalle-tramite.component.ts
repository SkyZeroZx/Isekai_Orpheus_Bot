import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import {
  Adjunto,
  Certificado,
  Detalle,
  TramiteDoc,
} from "src/app/entities/tramite";
import { ServiciosService } from "src/app/services/servicios.service";
import { BsModalService, ModalDirective } from "ngx-bootstrap/modal";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { Constant } from "src/app/Constants/Constant";

@Component({
  selector: "app-detalle-tramite",
  templateUrl: "./detalle-tramite.component.html",
  styleUrls: ["./detalle-tramite.component.scss"],
})
export class DetalleTramiteComponent implements OnInit {
  // Parametro de entrada que viene apartir del componente padre tramitesComponent
  @Input() in_tramite: TramiteDoc;
  // Declaramos nuestro input para pasarle posteriormente al componente hijo edit-tramite para editar el detalle
  updateDetalle: Detalle;
  @ViewChild("modalMod", { static: false }) modalMod: ModalDirective;
  // Declaramos nuestros FormGroup
  detalleForm: FormGroup;
  // Declaramos arreglos de tramites
  listaDetalles: Detalle[];
  listaAdjuntos: Adjunto[] = [];
  listaCertificado: Certificado[] = [];
  listaTramiteDoc: TramiteDoc[];
  // Declaramos nuestras entidades
  detalleEliminar: Detalle;
  certificadoEliminar: Certificado;
  // Validaciones booleanas para mostrar la tabla segun se requiera
  listaTramiteOk: boolean = false;
  adjuntoOk: boolean = false;
  certificadoOk: boolean = false;
  seleccionEditOk = false;
  // Variable que determina que registro se elimina ( Un detalle Tramite o un Certificado)
  optionDelete: number;

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
  }

  // Detecta cambio en la variable Input para cargar nuevo tramite seleccionado
  ngOnChanges(_changes: SimpleChanges) {
    this.crearFormularios();
    this.detalleTramite();
  }

  // Metodo que toma el detalle seleccionado y muestra el modar de modificacion para editar
  seleccionarDetalle(detalleSeleccionado) {
    this.updateDetalle = detalleSeleccionado;
    this.seleccionEditOk = true;
    this.modalMod.show();
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
    this.leerAdjuntos();
    this.leerCertificados();
  }

  updateCreateTramite(estado) {
    this.leerDetalles();
    this.leerCertificados();
    this.detalleForm.controls["detalleEstado"].setValue(estado);
  }

  // Metodo que llama el detalle del tramite seleccionado
  public leerDetalles() {
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

  // Llamada al servicio para eliminar detalleTramite
  callServicedeleteDetalleTramite(): void {
    this.servicios.deleteTramite(this.detalleEliminar).subscribe({
      next: (res) => {
        if (res.message == Constant.MENSAJE_OK) {
          this.toastrService.success(
            "Se elimino correctamente el detalle",
            "Exito",
            {
              timeOut: 3000,
            }
          );
          Swal.fire(
            "Eliminado!",
            "El registro fue eliminado con exito",
            "success"
          );
          this.leerDetalles();
        } else {
          this.toastrService.error(res.message, "Error", {
            timeOut: 3000,
          });
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
        if (res.message == Constant.MENSAJE_OK) {
          this.toastrService.success(
            "Se elimino correctamente el certificado",
            "Exito",
            {
              timeOut: 3000,
            }
          );
          Swal.fire(
            "Eliminado!",
            "El registro fue eliminado con exito",
            "success"
          );
          this.leerCertificados();
        } else {
          this.toastrService.error(res.message, "Error", {
            timeOut: 3000,
          });
        }
      },
      error: (err) => {
        console.log("deleteCertificado error", err);
        this.toastrService.error("Sucedio un error al eliminar el certificado " + err, "Error", {
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
      }
    });
  }
}
