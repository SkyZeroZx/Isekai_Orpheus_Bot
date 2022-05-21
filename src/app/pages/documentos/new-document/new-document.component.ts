import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { Constant } from "src/app/Constants/Constant";
import { ServiciosService } from "src/app/services/servicios.service";

@Component({
  selector: "app-new-document",
  templateUrl: "./new-document.component.html",
  styleUrls: ["./new-document.component.scss"],
})
export class NewDocumentComponent implements OnInit {
  crearDocForm: FormGroup;
  constructor(
    private servicios: ServiciosService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private toastrService: ToastrService
  ) {}

  // Al renderizar el componente creamos nuestro reactiveForm
  ngOnInit(): void {
    this.crearFormularioCreateUser();
  }

  // Metodo para creacion de reactiveForm
  crearFormularioCreateUser() {
    this.crearDocForm = this.fb.group({
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

  // Metodo que llama al servicio createDocument
  crearDocumento() {
    // Le pasamos los valores de nuestro formulario
    this.servicios.createDocument(this.crearDocForm.value).subscribe({
      next: (res) => {
        if (res.message == Constant.MENSAJE_OK) {
          this.toastrService.success(
            "Se creo exitosamente el documento",
            "Exito",
            {
              timeOut: 2000,
            }
          );
        } else {
          this.toastrService.error(res.message, "Error", {
            timeOut: 3000,
          });
        }
      },
      error: (err) => {
        this.toastrService.error("Sucedio un error" + err, "Error", {
          timeOut: 3000,
        });
      },
    });
  }
}
