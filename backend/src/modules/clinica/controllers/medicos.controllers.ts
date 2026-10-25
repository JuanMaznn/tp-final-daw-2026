import { Body, Controller, ForbiddenException, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { ListReservaDTO } from "../dtos/output/list-reserva.dto.js";
import { UpdateEstadoReservaDto } from "../dtos/input/update-estado-reserva.dto.js";
import { ReservaFechaQueryDto } from "../dtos/input/reserva-fecha.query.dto.js";
import { ReservasService } from "../services/reservas.service.js";
import { MedicoService } from "../services/medicos.service.js";
import { ListMedicoDTO } from "../dtos/output/list-medicos.dto.js";
import { AuthGuard } from "../../auth/guards/auth.guard.js";
import { RolesGuard } from "../../auth/guards/roles.guard.js";
import { Roles } from "../../auth/decorators/roles.decorator.js";
import { RolesUsuariosEnum } from "../../auth/enums/roles-usuarios.enum.js";

@Controller("medicos")
export class MedicosController{
    constructor(
        private readonly reservaS: ReservasService,
        private readonly medicoS: MedicoService,
    ){}

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: ListMedicoDTO, isArray: true })
    @Get()
    async listarMedicos(): Promise<ListMedicoDTO[]>{
        return this.medicoS.listarMedicos();
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.MEDICO)
    @ApiOkResponse({ type: ListReservaDTO, isArray: true })
    @Get(':id_medico/reserva')
    async obtenerReservaPorFecha(
        @Param('id_medico', ParseIntPipe) idMedico: number,
        @Query() query: ReservaFechaQueryDto,
        @Req() request: Request & { usuario: { sub: number } },
    ): Promise<ListReservaDTO[]>{
        // Un médico solo puede ver su propia agenda.
        const idMedicoLogueado: number = await this.reservaS.obtenerIdMedicoDeUsuario(request['usuario'].sub);
        if (idMedico !== idMedicoLogueado) {
            throw new ForbiddenException('No tiene permisos para ver la agenda de otro médico');
        }
        return this.reservaS.obtenerReservaPorFecha(idMedico, query.fecha)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RolesUsuariosEnum.MEDICO)
    @Patch(':id_reserva/estado')
    async cambiarEstadoReserva(
        @Param('id_reserva', ParseIntPipe) idReserva: number,
        @Body() updEstado: UpdateEstadoReservaDto,
        @Req() request: Request & { usuario: { sub: number } },
    ): Promise<void>{
        // Un médico solo puede cambiar el estado de sus propios turnos.
        const idMedicoLogueado: number = await this.reservaS.obtenerIdMedicoDeUsuario(request['usuario'].sub);
        return this.reservaS.cambiarEstadoReserva(idReserva, updEstado.estado, idMedicoLogueado)
    }
}