import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { TramiteDoc } from "src/app/entities/tramite";
import { ServiciosService } from "src/app/services/servicios.service";
import { ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ReporteService } from "src/app/services/report.service";

@Component({
  selector: "app-tramites",
  templateUrl: "./tramites.component.html",
  styleUrls: ["./tramites.component.scss"],
})
export class TramitesComponent implements OnInit {
  consultaForm: FormGroup;
  listaTramiteDoc: TramiteDoc[];
  tramiteSeleccionado: TramiteDoc;
  listaTramiteOk = false;
  modalVisible = false;
  p = 1;

  @ViewChild(ModalDirective, { static: false }) modal: ModalDirective;
  constructor(
    private servicios: ServiciosService,
    private fb: FormBuilder,
    //private modalService: BsModalService,
    private toastrService: ToastrService,
    private reporteService: ReporteService
  ) {}

  ngOnInit() {
    // Al renderizar componente creamos nuestro reactiveForm y cargamos la lista de tramites
    this.crearFormularioConsulta();
    this.listarTramiteDoc();
  }

  // Metodo para creacion de reactiveForm
  crearFormularioConsulta() {
    this.consultaForm = this.fb.group({
      filterTramite: new FormControl(""),
      filterCodEstudiante: new FormControl(""),
      filterApellidos: new FormControl(""),
      filterNombres: new FormControl(""),
      filterEstado: new FormControl(""),
      filterFecha: new FormControl(""),
      filterTipoTramite: new FormControl(""),
    });
  }

  // Llamada al servicio listarTramites
  listarTramiteDoc(): void {
    this.servicios.listaTramites().subscribe({
      next: (res: TramiteDoc[]) => {
        //Recibido nuestra respuesta del servicio
        this.listaTramiteDoc = res;
        this.listaTramiteOk = true;
      },
      error: (err) => {
        // En caso de Error
        this.toastrService.error("Sucedio un error al listar tramites " +err, "Error", {
          timeOut: 3000,
        });
      },
    });
  }

  // Asignacion de tramite seleccionado para el componente hijo detalletramite y llamada al modal donde se encuentra
  detalleTramite(tramite: TramiteDoc) {
    this.tramiteSeleccionado = tramite;
    this.modal.show();
    this.modalVisible = true;
  }

  onChangeForm() {
    this.p = 1;
  }
  exportarExcel() {
    this.reporteService.exportAsExcelFile("REPORTE TRAMITES");
  }

  exportarPDF() {
    const encabezado =['N° TRAMITE','FECHA','ESTADO ACTUAL','TRAMITE','CODIGO ESTUDIANTE','NOMBRES','APELLIDOS']
    this.reporteService.exportAsPDF("REPORTE TRAMITES", encabezado);
  }
}
