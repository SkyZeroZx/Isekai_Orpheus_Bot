import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Constant } from "src/app/Constants/Constant";
import { Detalle } from "src/app/entities/tramite";
import { ServiciosService } from "src/app/services/servicios.service";

@Component({
  selector: "app-edit-tramite",
  templateUrl: "./edit-tramite.component.html",
  styleUrls: ["./edit-tramite.component.scss"],
})
export class EditTramiteComponent implements OnInit {
  @Input() in_updateDetalle: Detalle;
  @Output() respuestaUpdateTramite = new EventEmitter();
  estadosActualizarForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private servicios: ServiciosService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.crearEstadoUpdateForm();
    this.detalleUpdateTramite();
  }

  crearEstadoUpdateForm() {
    this.estadosActualizarForm = this.fb.group({
      id_est_doc: new FormControl(),
      fecha: new FormControl(),
      estado: new FormControl(),
      observaciones: new FormControl(""),
    });
  }

  detalleUpdateTramite() {
    this.estadosActualizarForm.controls.id_est_doc.setValue(
      this.in_updateDetalle.id_est_doc
    );
    this.estadosActualizarForm.controls.fecha.setValue(
      this.in_updateDetalle.fecha
    );
    this.estadosActualizarForm.controls.estado.setValue(
      this.in_updateDetalle.estado
    );
    this.estadosActualizarForm.controls.observaciones.setValue(
      this.in_updateDetalle.observaciones
    );
  }
  
  // Detecta cambio en la variable Input para cargar nuevo tramite seleccionado
  ngOnChanges(_changes: SimpleChanges) {
    this.crearEstadoUpdateForm();
    this.detalleUpdateTramite();
  }

  // Metodo utilizado al editar el estado y/o observaciones de un estado del tramite seleccionado
  actualizarEstadoTramite() {
    this.servicios.updateStatusTramite(this.estadosActualizarForm.value).subscribe({
      next: (res) => {
        if (res.message == Constant.MENSAJE_OK) {
          this.respuestaUpdateTramite.emit();
          this.toastrService.success(
            "Se actualizo correctamente el estado para " +
              this.in_updateDetalle.id_est_doc,
            "Exito",
            {
              timeOut: 3000,
            }
          );
        } else {
          this.toastrService.error(res.message, "Error", {
            timeOut: 3000,
          });
        }
      },
      error: (err) => {
        console.log("modificarEstado Error ", err);
        this.toastrService.error("Sucedio un error al modificar el estado : "+ err, "Error", {
          timeOut: 5000,
        });
      },
    });
  }
}
