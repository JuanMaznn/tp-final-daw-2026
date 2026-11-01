// Misma forma que CreateReservaAdminDto del back (dtos/input/create-reserva-admin.dto.ts)
export interface CreateReservaAdminDTO {
    id_medico: number;
    id_paciente: number;
    fecha_hora: string;
}
