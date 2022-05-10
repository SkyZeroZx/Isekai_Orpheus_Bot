export class Tramite {
  FECHA: string;
  ESTADO: string;
  OBSERVACIONES: string;
  URL: string;
}

export class Detalle {
  id_est_doc: string;
  fecha: Date;
  estado: string;
  observaciones: string;
}

export class Imagen {
  URL: string;
  FECHA: string;
  ID_EST_DOC: string;
}

export class Adjunto {
  URL: string;
  FECHA: string;
  ID_EST_DOC: string;
}

export class Certificado {
  url: string;
  fecha: string;
  id_est_doc: string;
}
export class DatosGrafico {
  registrado: number;
  procesando: number;
  observado: number;
  finalizado: number;
}


export class TramiteDoc {
    apellidos: string;
    estudiante: string;
    cod_est: string;
    nombre: Date;
    estado: string;
    id_est_doc:string;
    fecha_doc:Date;
}
 