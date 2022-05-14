import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { ServiciosService } from "src/app/services/servicios.service";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  usuarioForm: FormGroup;
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
    this.usuarioForm = this.fb.group({
      filterCodUser: new FormControl(""),
      filterEmailUser: new FormControl(""),
      filterRolUser: new FormControl(""),
    });
  }
  detalleUsuario() {}
  eliminarUsuario() {}
  onChangeForm() {
    this.p = 1;
  }
  resetearUsuario(){}
  crearUsuario() {}
  exportarExcel() {}
  exportarPDF() {}
}
