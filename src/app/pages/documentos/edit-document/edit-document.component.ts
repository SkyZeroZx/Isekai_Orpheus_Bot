import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Constant } from "src/app/Constants/Constant";
import { Documento } from "src/app/entities/tramite";
import { ServiciosService } from "src/app/services/servicios.service";

@Component({
  selector: "app-edit-document",
  templateUrl: "./edit-document.component.html",
  styleUrls: ["./edit-document.component.scss"],
})
export class EditDocumentComponent implements OnInit {
  editarDocForm: FormGroup;
  @Input() in_doc: Documento;
  constructor(
    private servicios: ServiciosService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastrService: ToastrService
  ) {}
  // Al renderizar componente creamos reactiveForm y seteamos valores de la variable de entrada desde el componente padre documentos
  ngOnInit(): void {
    this.crearFormularioEditarDoc();
    this.detalleDocumento();
  }

  // Detecta cambio en la variable Input para cargar nuevo tramite seleccionado
  ngOnChanges(changes: SimpleChanges) {
    this.crearFormularioEditarDoc();
    this.detalleDocumento();
  }

  // Asignamos los valores de nuestra variable de entrada in_user a nuestro formulario , in_user viene del componente padre usersComponent
  detalleDocumento() {
    this.editarDocForm.controls.cod_doc.setValue(this.in_doc.cod_doc);
    this.editarDocForm.controls.nombre.setValue(this.in_doc.nombre);
    this.editarDocForm.controls.requisitos.setValue(this.in_doc.requisitos);
  }
  // Metodo que llama al servicio updateDocument
  actualizarDocumento() {
    this.servicios.updateDocument(this.editarDocForm.value).subscribe({
      next: (res) => {
        switch (res.message) {
          case Constant.MENSAJE_OK:
            this.toastrService.success(
              "Se actualizo exitosamente el documento",
              "Exito",
              {
                timeOut: 2000,
              }
            );
            break;
          default:
            this.toastrService.error(
              "Sucedio un error al editar : " + res.message,
              "Error",
              {
                timeOut: 3000,
              }
            );
            break;
        }
      },
      error: (err) => {
     //   console.log("Error actualizarDocumento ", err);
        this.toastrService.error("Hubo un error " + err, "Error", {
          timeOut: 3000,
        });
      },
    });
  }
  // Metodo para creacion de reactiveForm
  crearFormularioEditarDoc() {
    this.editarDocForm = this.fb.group({
      cod_doc: new FormControl(""),
      nombre: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(150),
        ])
      ),
      requisitos: new FormControl(
        "",
        Validators.compose([Validators.required])
      ),
    });
  }
}