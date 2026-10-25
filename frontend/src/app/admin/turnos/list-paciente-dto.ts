// Misma forma que ListPacienteDTO del back (dtos/output/list-paciente.dto.ts)
export interface ListPacienteDTO {
    id: number;
    documento: string;
    nombres: string;
    apellidos: string;
    // Campo solo del front: texto que muestra el selector ("Apellido, Nombre (documento)")
    nombreCompleto?: string;
}
