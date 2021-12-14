export class Tramite {
  FECHA: string;
  ESTADO: string;
  OBSERVACIONES: string;
  URL: string;
}

export class Detalle {
  ID_EST_DOC: string;
  FECHA: string;
  ESTADO: string;
  OBSERVACIONES: string;
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
  URL: string;
  FECHA: string;
  ID_EST_DOC: string;
}
export class DatosGrafico {
  registrado: number;
  procesando: number;
  observado: number;
  finalizado: number;
}

export class Contador {
  pendientes: number;
  procesando: number;
  observado: number;
  finalizado: number;
}

export class TramiteDoc {
    APELLIDOS: string;
    ESTUDIANTE: string;
    COD_EST: string;
    FECHA_DOC: Date;
    ESTADO: string;
    ID_EST_DOC:string;
}
 