export interface Tramite {
  FECHA: string;
  ESTADO: string;
  OBSERVACIONES: string;
  URL: string;
}

export interface Detalle {
  id_est_doc: string;
  fecha: Date;
  estado: string;
  observaciones: string;
}

export interface Imagen {
  URL: string;
  FECHA: string;
  ID_EST_DOC: string;
}

export interface Adjunto {
  URL: string;
  FECHA: string;
  ID_EST_DOC: string;
}

export interface Certificado {
  url: string;
  fecha: string;
  id_est_doc: string;
}
export interface DatosGrafico {
  registrado: number;
  procesando: number;
  observado: number;
  finalizado: number;
}

export interface TramiteDoc {
  apellidos: string;
  estudiante: string;
  cod_est: string;
  nombre: string;
  estado: string;
  id_est_doc: string;
  fecha_doc: Date;
}

export interface Documento{
  cod_doc : string;
  nombre : string;
  requisitos:string;
}
