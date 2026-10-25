// Misma forma que ListReservaDTO del back (dtos/output/list-reserva.dto.ts)
export interface ListReservaDTO {
    id: number;
    fechaHora: string;
    estado: string;
    valorConsulta: number;
    medico: { nombres: string; apellidos: string };
    paciente: { nombres: string; apellidos: string };
}
