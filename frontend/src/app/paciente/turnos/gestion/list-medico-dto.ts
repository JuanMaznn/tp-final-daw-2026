// Misma forma que ListMedicoDTO del back (dtos/output/list-medicos.dto.ts)
export interface ListMedicoDTO {
    id: number;
    idUsuario: number;
    matricula: number;
    valorConsulta: number;
    nombres: string;
    apellidos: string;
    // Campo solo del front: texto que muestra el selector ("Apellido, Nombre")
    nombreCompleto?: string;
}
