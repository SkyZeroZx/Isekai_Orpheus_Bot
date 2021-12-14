import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Adjunto, Certificado, Contador, DatosGrafico, Detalle, Imagen, Tramite, TramiteDoc } from "../entities/tramite";
@Injectable({
  providedIn: "root",
})
export class ServiciosService {
  ruta = "https://cameronian-treatmen.000webhostapp.com/angular/prueba.php";
  u="https://cameronian-treatmen.000webhostapp.com/angular/"
  rutab = "https://cameronian-treatmen.000webhostapp.com/angular/barras.php";

  tramites: Tramite[];
  detalles: Detalle[];
  imagenes: Imagen[];
  adjuntos : Adjunto[];
  certificados : Certificado[];

  constructor(private http: HttpClient) {}

  public getAll(): Observable<any> {
    return this.http.get<any>(this.ruta);
  }

  public fromCountry(country: string): Observable<any> {
    return this.getAll().pipe(map((data) => data[country]));
  }

  public twoDates(
    estado: string,
    DateFrom: Date,
    dateTo: Date
  ): Observable<any> {
    return this.fromCountry(estado).pipe(
      map((res) =>
        res.filter(
          (val) =>
            new Date(val.fecha) >= DateFrom && new Date(val.fecha) <= dateTo
        )
      )
    );
  }

  public getAllMonth(): Observable<any> {
    return this.http.get<any>(this.rutab);
  }

  public fromCountryM(country: string): Observable<any> {
    return this.getAllMonth().pipe(map((data) => data[country]));
  }

  public twoMonths(
    estado: string,
    DateFrom: Date,
    dateTo: Date
  ): Observable<any> {
    return this.fromCountryM(estado).pipe(
      map((res) =>
        res.filter((val) => val.fecha >= DateFrom && val.fecha <= dateTo)
      )
    );
  }

  dpies: DatosGrafico[];
  buscarPie(estado, DateFrom, dateTo): Observable<DatosGrafico[]> {
    const ruta =
      "https://cameronian-treatmen.000webhostapp.com/angular/pie.php";
    const formData: FormData = new FormData();
    formData.append("ESTADO", estado);
    formData.append("INICIO", DateFrom);
    formData.append("FIN", dateTo);
    return this.http.post<DatosGrafico[]>(ruta, formData).pipe(
      map((res) => {
        this.dpies = JSON.parse(JSON.stringify(res));
        return this.dpies;
      })
    );
  }

  contador: Contador[];
  ContadorTramites(): Observable<Contador[]> {
    const ruta =
      "https://cameronian-treatmen.000webhostapp.com/angular/contador_tramite.php";
    return this.http.post<Contador[]>(ruta, null).pipe(
      map((res) => {
        this.contador = JSON.parse(JSON.stringify(res));
        return this.contador;
      })
    );
  }

  tramiteDoc :TramiteDoc[];
  
  listaTramites(): Observable<TramiteDoc[]>{
    const ruta ="https://cameronian-treatmen.000webhostapp.com/angular/servicio_tramite.php"
     return this.http.post<TramiteDoc[]>(ruta,null).pipe(
       map((res) => {
         this.tramiteDoc = JSON.parse(JSON.stringify(res));
         return this.tramiteDoc;
       })
     )
   }


   buscarDetallesD(ID_EST_DOC): Observable<Detalle[]>{
    const ruta = "https://cameronian-treatmen.000webhostapp.com/angular/servicio_detalled.php";
    const formData: FormData = new FormData();
    formData.append("caty",ID_EST_DOC);
    return this.http.post<Detalle[]>(ruta,formData).pipe(
      map((res) => {
        this.detalles = JSON.parse(JSON.stringify(res));
        return this.detalles;
      })
    )
  }


  buscarImagenes(ID_EST_DOC): Observable<Imagen[]>{
    const ruta =this.u+"busca_imagen.php"
    const formData: FormData = new FormData();
    formData.append("ID_EST_DOC",ID_EST_DOC);
    return this.http.post<Imagen[]>(ruta,formData).pipe(
      map((res) => {
        this.imagenes = JSON.parse(JSON.stringify(res));
        return this.imagenes;
      })
    )
   }

   buscarAdjuntos(ID_EST_DOC): Observable<Adjunto[]>{
    const ruta =this.u+"busca_adjunto.php"
    const formData: FormData = new FormData();
    formData.append("ID_EST_DOC",ID_EST_DOC);
      return this.http.post<Adjunto[]>(ruta,formData).pipe(
        map((res) => {
          this.adjuntos = JSON.parse(JSON.stringify(res));
          return this.adjuntos;
        })
      )
  }


  buscarCertificado(ID_EST_DOC): Observable<Certificado[]>{
    const ruta =this.u+"buscar_certificado.php"
    const formData: FormData = new FormData();
    formData.append("ID_EST_DOC",ID_EST_DOC);
    return this.http.post<Certificado[]>(ruta,formData).pipe(
      map((res) => {
        this.certificados = JSON.parse(JSON.stringify(res));
        return this.certificados;
      })
    )
   }

   insertarTramite(ID_EST_DOC,ESTADO,OBSERVACIONES){
    const ruta = "https://cameronian-treatmen.000webhostapp.com/angular/registrar_estado.php"
    const formData: FormData = new FormData();
    formData.append("ID_EST_DOC",ID_EST_DOC);
    formData.append("ESTADO",ESTADO);
    formData.append("OBSERVACIONES",OBSERVACIONES);
    return this.http.post(ruta,formData)
  }

  uploadFile(archivo) {
    const ruta="https://cameronian-treatmen.000webhostapp.com/angular/subir_archivo.php"
    return this.http.post(
      ruta, 
      JSON.stringify(archivo));
  }


  estadoUpdate(ID_EST_DOC,OBSERVACIONES,FECHA,ESTADO){
    const ruta = "https://cameronian-treatmen.000webhostapp.com/angular/actualizar_detalle.php";
    const formData: FormData = new FormData();
    formData.append("ID_EST_DOC",ID_EST_DOC);
    formData.append("OBSERVACIONES",OBSERVACIONES);
    formData.append("FECHA",FECHA);
    formData.append("ESTADO",ESTADO);
    return this.http.post(ruta,formData)
  }



}
