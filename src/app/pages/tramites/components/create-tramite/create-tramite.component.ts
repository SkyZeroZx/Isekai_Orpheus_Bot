import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Observable, ReplaySubject } from "rxjs";
import { Constant } from "src/app/Constants/Constant";
import { TramiteDoc } from "src/app/entities/tramite";
import { ServiciosService } from "src/app/services/servicios.service";
import { Buffer } from "buffer";
@Component({
  selector: "app-create-tramite",
  templateUrl: "./create-tramite.component.html",
  styleUrls: ["./create-tramite.component.scss"],
})
export class CreateTramiteComponent implements OnInit {
  // Datos de entrada desde el componente padre detalleTramite
  @Input()
  in_NewTramite: TramiteDoc;
  // Evento que vamos emitir para actualizar al finalizar el registro
  @Output()
  respuestaRegistroTramite = new EventEmitter<any>();
  // Declaramos los FormGroup de nuestros formularios
  registrarForm: FormGroup;
  uploadForm: FormGroup;
  // Declaramos nuestro arreglo de archivos para la subida de certificados
  uploadedFiles: Array<File>;
  // Variable que obtiene la base64
  base64Output: string;
  // Nombre inicializado del label de seleccion de archivos para subir certificado
  fileName: string = "Seleccione un archivo (PDF)";
  constructor(
    private servicios: ServiciosService,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.createTramiteForms();
  }

  createTramiteForms(): void {
    this.registrarForm = this.fb.group({
      id_est_doc: new FormControl(),
      estado: new FormControl("", Validators.compose([Validators.required])),
      observaciones: new FormControl("", [
        Validators.required,
        Validators.maxLength(255),
      ]),
    });
    this.uploadForm = new FormGroup({
      subir: new FormControl(null, [Validators.required]),
    });
  }

  // Metodo para registrar nuestro detalle del tramite seleccionado
  registraEstado(values) {
    values.id_est_doc = this.in_NewTramite.id_est_doc;
    this.servicios.createTramite(values).subscribe({
      next: (res) => {
        if (res.message == Constant.MENSAJE_OK) {
          this.toastrService.success(
            "Se registro exitosamente un nuevo estado para " +
              this.in_NewTramite.id_est_doc,
            "Exito",
            {
              timeOut: 2000,
            }
          );
          this.registrarForm.reset();
          this.registrarForm.controls["estado"].setValue("", {
            onlySelf: true,
          });
          this.respuestaRegistroTramite.emit(values.estado);
        } else {
          this.respuestaRegistroTramite.emit();
          this.toastrService.error(res.message, "Error", {
            timeOut: 3000,
          });
        }
      },
      error: (err) => {
        console.log("regisraEstado error", err);
        this.respuestaRegistroTramite.emit();
        this.toastrService.error("Sucedio un error al registrar el nuevo estado :"+ err, "Error", {
          timeOut: 5000,
        });
      },
    });
  }

  // Metodo para seleccionar archivo a subir como certificado
  seleccionarArchivo(event) {
    // Validamos que sea diferente de undefined
    if (typeof event.target.files[0] !== "undefined") {
      this.convertFile(event.target.files[0]).subscribe((base64) => {
        this.fileName = event.target.files[0].name;
        this.uploadForm.controls.subir.setValue(base64);
      });
    }
  }

  // Metodo para convertir a base64 el archivo seleccionado
  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      result.next(
        Buffer.from(event.target.result.toString(), "binary").toString("base64")
      );
    };
    return result;
  }

  // Metodo para enviar la base64 e ID del tramite al servicio y subirlo
  upload() {
    const values = {
      id: this.in_NewTramite.id_est_doc,
      base64: this.uploadForm.getRawValue().subir,
    };
    this.servicios.uploadFile(values).subscribe({
      next: (res) => {
        if (res.message == Constant.MENSAJE_OK) {
          this.uploadForm.reset();
          this.fileName = "Seleccione un archivo (PDF)";
          this.toastrService.success(
            "Se subio correctamente certificado para el tramite" +
              this.in_NewTramite.id_est_doc,
            "Exito",
            {
              timeOut: 3000,
            }
          );
          this.respuestaRegistroTramite.emit();
        } else {
          this.toastrService.error(res.message, "Error", {
            timeOut: 3000,
          });
        }
      },
      error: (err) => {
        console.log("upload error ", err);
        this.toastrService.error("Ocurrio un error al subir el certificado " + err, "Error", {
          timeOut: 5000,
        });
      },
    });
  }
}
