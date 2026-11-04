export interface ListPacienteDTO {
  id: number;
  documento: string;
  nombres: string;
  apellidos: string;
  nombreCompleto?: string;
}
