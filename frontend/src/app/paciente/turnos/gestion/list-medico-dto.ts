export interface ListMedicoDTO {
  id: number;
  idUsuario: number;
  matricula: number;
  valorConsulta: number;
  nombres: string;
  apellidos: string;
  nombreCompleto?: string;
}
