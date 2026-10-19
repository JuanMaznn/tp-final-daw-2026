import { ApiProperty } from "@nestjs/swagger";
import { EstadosReservasEnum } from "../../enums/estados-reservas.enum.js";

export class ListReservaMedicoDTO {
    @ApiProperty()
    nombres!: string;

    @ApiProperty()
    apellidos!: string;
}

export class ListReservaPacienteDTO {
    @ApiProperty()
    nombres!: string;

    @ApiProperty()
    apellidos!: string;
}

export class ListReservaDTO {
    @ApiProperty()
    id!: number;

    @ApiProperty()
    fechaHora!: Date;

    @ApiProperty({ enum: EstadosReservasEnum })
    estado!: EstadosReservasEnum;

    @ApiProperty()
    valorConsulta!: number;

    @ApiProperty({ type: ListReservaMedicoDTO })
    medico!: ListReservaMedicoDTO;

    @ApiProperty({ type: ListReservaPacienteDTO })
    paciente!: ListReservaPacienteDTO;
}
