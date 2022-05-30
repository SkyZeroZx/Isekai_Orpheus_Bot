import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { SwPush } from "@angular/service-worker";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Constant } from "src/app/Constants/Constant";
import { Adjunto, Certificado, Detalle } from "src/app/entities/tramite";
import { ServiciosService } from "src/app/services/servicios.service";
import { environment } from "src/environments/environment";

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
  listaTramitesGuardados: [] = [];
  @ViewChild(ModalDirective, { static: false }) modalHistory: ModalDirective;
  constructor(
    private fb: FormBuilder,
    private servicios: ServiciosService,
    private toastrService: ToastrService,
    private swPush: SwPush,
    private route: ActivatedRoute
  ) {}

  // Al renderizar el componente creamos nuestro reactiveForm
  ngOnInit(): void {
    this.crearFormularioTracking();
    this.suscribirClickPush();
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

  // Metodo que formatea la data para ser enviada posteriormente
  formatData(tokenPush: any, id: string) {
    return {
      id_est_doc: id,
      tokenPush,
    };
  }

  suscribirClickPush(): void {
    // suscripcion a queryParams en caso se realiza click en notificacion realizar la busqueda del tramite
    this.route.queryParams.subscribe((params) => {
      if (
        typeof params.idDocTramite !== undefined &&
        typeof params.dni !== undefined &&
        Object.entries(params).length !== 0
      ) {
        this.trackingForm.controls.idDocTramite.setValue(params.idDocTramite);
        this.trackingForm.controls.dni.setValue(params.dni);
        this.buscarTramiteTracking();
      }
    });
  }

  // Metodo que guarda en el localStorage los tramites del usuario y los suscribe a la notificacion Push del navegador
  saveTracking() {
    if (this.detalleOk) {
      if (this.trackingForm.valid) {
        this.addEntry();
        this.suscribeToNotifications();
      } else {
        this.toastrService.error(
          "Los valores ingresados deben ser validos",
          "Error",
          {
            timeOut: 5000,
          }
        );
      }
    } else {
      this.toastrService.error(
        "Debe realizar una busqueda para guardar el tramite",
        "Error",
        {
          timeOut: 5000,
        }
      );
    }
  }

  // Metodo que solicita al usuario habilitar las notificaciones en el navegador
  suscribeToNotifications(): any {
    console.log("suscribeToNotifications");
    // Realizamos la suscripcion a las notificaciones del navegador  13161522543671642522 71642522  13161521506970666555 72514695
    this.swPush
      .requestSubscription({
        serverPublicKey: environment.VAPID_PUBLIC_KEY,
      })
      .then((tokens) => {
        // Validamos que el usuario de permisos
        console.log('Request Tokens Subscription')
        this.saveNotification(tokens);
      })
      .catch((err) => {
        // En caso contrario de suceder un error lo notificamos
        this.toastrService.error(
          "Sucedio un error al suscribirse " + err,
          "Error",
          {
            timeOut: 5000,
          }
        );
      });
  }

  // Metodo que verifica que los elementos guardados en el localStorage no sean repetidos al momento de guardarse
  addEntry() {
    let existingEntries = JSON.parse(localStorage.getItem("tracking"));
    if (existingEntries == null) existingEntries = [];
    let entry = {
      id_est_doc: this.trackingForm.value.idDocTramite,
      dni: this.trackingForm.value.dni,
    };
    existingEntries.push(entry);
    let hash = {};
    existingEntries = existingEntries.filter((e) => {
      let exists = !hash[e.id_est_doc];
      hash[e.id_est_doc] = true;
      return exists;
    });
    console.log("existen "+existingEntries)
    localStorage.setItem("tracking", JSON.stringify(existingEntries));
    this.toastrService.success("Se guardo su tramite", "Exito", {
      timeOut: 5000,
    });
  }

  // Funcion que valida localStorage y guarda las notificaciones en caso de haberlas
  saveNotification(tokens) {
    let tracking = JSON.parse(localStorage.getItem("tracking"));
    if (tracking !== null) {
      for (let value of tracking) {
        this.servicios
          .saveUserNotification(this.formatData(tokens, value.id_est_doc))
          .subscribe({
            next: (res) => {
              // Para el caso de exito de respuesta del servicio saveUserNotification
              if (res.message == Constant.MENSAJE_OK) {
                this.toastrService.success(
                  "Las notificaciones fueron habilitadas exitosamente",
                  "Exito",
                  {
                    timeOut: 5000,
                  }
                );
              } else {
                this.toastrService.error(
                  "Sucedio un error al suscribir sus notificaciones",
                  "Error",
                  {
                    timeOut: 5000,
                  }
                );
              }
            },
            error: (err) => {
              // En caso de un error con el servicio lo mostramos
              this.toastrService.error(
                "Sucedio un error al suscribir sus notificaciones " + err,
                "Error",
                {
                  timeOut: 5000,
                }
              );
            },
          });
      }
    }
  }

  // Metodo que muestra el modalHistory con los tramites guardados en el LocalStorage por el usuario
  listHistory(): void {
    this.modalHistory.show();
    this.listaTramitesGuardados = JSON.parse(localStorage.getItem("tracking"));
  }

  // Metodo que setea los valores al trackingForm y ejecuta el metodo buscarTramiteTracking para mostrar el tramite seleccionado al usuario
  searchHistory(value): void {
    this.trackingForm.controls.idDocTramite.setValue(value.id_est_doc);
    this.trackingForm.controls.dni.setValue(value.dni);
    this.buscarTramiteTracking();
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
          this.toastrService.error(
            "Sucedio un error al buscar el tramite " + err,
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
          this.toastrService.error(err, "Error", {
            timeOut: 5000,
          });
        },
      });
  }
}
