import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { BsModalService, ModalDirective } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Constant } from "src/app/Constants/Constant";
import { Documento } from "src/app/entities/tramite";
import { ReporteService } from "src/app/services/report.service";
import { ServiciosService } from "src/app/services/servicios.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-documentos",
  templateUrl: "./documentos.component.html",
  styleUrls: ["./documentos.component.scss"],
})
export class DocumentosComponent implements OnInit {
  documentosForm: FormGroup;
  listaDocumentos: Documento[];
  listaDocumentosOk: boolean = false;
  crearDocumentoOk: boolean = false;
  editarDocumentOK: boolean = false;
  documentoSeleccionado: Documento;
  // Variable que indica pagina actual del paginator
  p: number = 1;
  @ViewChild("modalNewDocument", { static: false })
  public modalNewDocument: ModalDirective;
  @ViewChild("modalEditDocument", { static: false })
  public modalEditDocument: ModalDirective;
  constructor(
    private servicios: ServiciosService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastrService: ToastrService,
    private reporteService: ReporteService
  ) {}

  ngOnInit(): void {
    // Al renderizar el componente creamos nuestro formulario y listamos
    this.crearFormularioConsulta();
    this.listarDocumentos();
  }

  // Metodo para creacion de reactiveForm
  crearFormularioConsulta() {
    this.documentosForm = this.fb.group({
      filterCodDoc: new FormControl(""),
      filterNomDoc: new FormControl(""),
    });
  }

  // En caso de suceder un cambio como eliminar para evitar errores en el paginator volvemos a la pagina 1
  ngOnChanges() {
    this.p = 1;
  }

  exportarExcel() {
    this.reporteService.exportAsExcelFile("REPORTE DOCUMENTOS");
  }
  exportarPDF() {
    const encabezado = ["CODIGO", "NOMBRE", "REQUISITOS"];
    this.reporteService.exportAsPDF("REPORTE DOCUMENTOS", encabezado);
  }

  // Metodo que llama al componente modal hijo new document
  crearDocumento() {
    this.crearDocumentoOk = true;
    this.modalNewDocument.show();
  }

  // Metodo que llama al componente modal hijo edit document
  editarDocumento(document) {
    this.documentoSeleccionado = document;
    this.editarDocumentOK = true;
    this.modalEditDocument.show();
  }

  listarDocumentos() {
    // Llamamos al servicio getAllDocuments para listar todos los documentos en la vista
    this.servicios.getAllDocuments().subscribe({
      next: (res) => {
        this.listaDocumentosOk = true;
        this.listaDocumentos = res;
        console.log("GetAllDocuments", res);
      },
      error: (err) => {
        this.toastrService.error("Error al listar documentos " + err, "Error", {
          timeOut: 3000,
        });
      },
    });
  }

  // Alerta de eliminacion de usuario
  alertDeleteDoc(documento) {
    Swal.fire({
      title: "Eliminar Documento",
      text:
        "Se va eliminar el documento " + documento.nombre + " ¿Esta seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(documento.cod_doc);
        // Caso de aceptar se llama al servicio de eliminar documento
        this.eliminarDocumento(documento.cod_doc);
      }
    });
  }

  // Metodo que llama al servicio para eliminar un documento
  eliminarDocumento(cod_doc) {
    // Formateamos el cod_doc para enviarlo al servicio deleteDocument
    const deleteData = {
      cod_doc: cod_doc,
    };
    // Llamamos al servicio
    this.servicios.deleteDocument(deleteData).subscribe({
      next: (res) => {
        if (res.message == Constant.MENSAJE_OK) {
          this.listarDocumentos();
          this.p = 1;
          this.toastrService.success(
            "Se elimino exitosamente el documento",
            "Exito",
            {
              timeOut: 3000,
            }
          );
        } else {
          this.toastrService.error("Sucedio un error al eliminar el documento "+ res.message, "Error", {
            timeOut: 3000,
          });
        }
      },
      error: (err) => {
        this.toastrService.error("Sucedio un error al eliminar el documento "+  + err, "Error", {
          timeOut: 3000,
        });
      },
    });
  }
}
