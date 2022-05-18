import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Adjunto, Certificado, Detalle } from "src/app/entities/tramite";
import { ServiciosService } from "src/app/services/servicios.service";

@Component({
  selector: "app-tracking",
  templateUrl: "./tracking.component.html",
  styleUrls: ["./tracking.component.scss"],
})
export class TrackingComponent implements OnInit {
  trackingForm: FormGroup;
  listaAdjuntos: Adjunto[] = [];
  listaDetalles: Detalle[];
  listaCertificado: Certificado[] = [];
  adjuntoOk: boolean = false;
  certificadoOk: boolean = false;
  detalleOk: boolean = false;

  constructor(
    private fb: FormBuilder,
    private servicios: ServiciosService,
    private toastrService: ToastrService
  ) {}
  
  // Al renderizar el componente creamos nuestro reactiveForm
  ngOnInit(): void {
    this.crearFormularioTracking();
  }

  // Metodo de creacion de reactiveForm para el component tracking
  crearFormularioTracking(): void {
    this.trackingForm = this.fb.group({
      idDocTramite: new FormControl("", [
        Validators.required,
        Validators.minLength(14),
      ]),
      dni: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ]),
    });
  }

  // Metodo que limpia nuestra tabla al realizar una nueva consulta
  limpiarTabla(): void {
    this.adjuntoOk = false;
    this.certificadoOk = false;
    this.detalleOk = false;
  }

  // Metodo que llama al servicio buscarTramiteDetalle por DNI y N°
  buscarTramiteTracking() {
    this.limpiarTabla();
    this.servicios
      .buscarTramiteDetalleDniAndId(this.trackingForm.value)
      .subscribe({
        next: (res: Detalle[]) => {
          if (res.length > 0) {
            this.listaDetalles = res;
            this.detalleOk = true;
            this.leerAdjuntos();
            this.leerCertificados();
          } else {
            this.limpiarTabla();
            this.toastrService.error(
              "No existe tramite que coincida con los datos ingresados",
              "Error",
              {
                timeOut: 5000,
              }
            );
          }
        },
        error: (err) => {
          console.log("buscarTramiteTracking error", err);
          this.toastrService.error(
            "Sucedio un error al buscar el tramite",
            "Error",
            {
              timeOut: 5000,
            }
          );
        },
      });
  }

  // Metodo que llama los adjuntos tramite seleccionado
  leerAdjuntos(): void {
    this.servicios
      .buscarAdjuntos(this.trackingForm.value.idDocTramite)
      .subscribe({
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
    this.servicios
      .buscarCertificado(this.trackingForm.value.idDocTramite)
      .subscribe({
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
}
