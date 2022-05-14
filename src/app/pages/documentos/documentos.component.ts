import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ServiciosService } from "src/app/services/servicios.service";

@Component({
  selector: "app-documentos",
  templateUrl: "./documentos.component.html",
  styleUrls: ["./documentos.component.scss"],
})
export class DocumentosComponent implements OnInit {
  documentosForm: FormGroup;
  p = 1;
  constructor(
    private servicios: ServiciosService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.crearFormularioConsulta();
  }
  // Metodo para creacion de reactiveForm
  crearFormularioConsulta() {
    this.documentosForm = this.fb.group({
      filterCodDoc: new FormControl(""),
      filterNomDoc: new FormControl(""),
    });
  }
  detalleDocumento() {}
  eliminarDocumento() {}
  onChangeForm() {
    this.p = 1;
  }

  exportarExcel(){}
  exportarPDF(){}
  crearDocumento() {}

}
