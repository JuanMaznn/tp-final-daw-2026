import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ListReservaDTO } from "../../paciente/turnos/listado/list-reserva-dto";
import { ListMedicoDTO } from "../../paciente/turnos/gestion/list-medico-dto";
import { ListPacienteDTO } from "./list-paciente-dto";
import { CreateReservaAdminDTO } from "./create-reserva-admin-dto";

@Injectable({
    providedIn: "root"
})
export class AdminApiClient {

    private readonly httpClient: HttpClient = inject(HttpClient);

    // fecha (AAAA-MM-DD) e idMedico son opcionales: si no se mandan, trae todos los turnos.
    buscarTurnos(fecha?: string, idMedico?: number, idPaciente?: number): Observable<ListReservaDTO[]> {
        let params: HttpParams = new HttpParams();
        if (fecha) {
            params = params.set("fecha", fecha);
        }
        if (idMedico) {
            params = params.set("id_medico", idMedico);
        }
        if (idPaciente) {
            params = params.set("id_paciente", idPaciente);
        }
        return this.httpClient.get<ListReservaDTO[]>("/api/v1/admin/reserva", { params });
    }

    buscarPacientes(): Observable<ListPacienteDTO[]> {
        return this.httpClient.get<ListPacienteDTO[]>("/api/v1/admin/pacientes");
    }

    buscarMedicos(): Observable<ListMedicoDTO[]> {
        return this.httpClient.get<ListMedicoDTO[]>("/api/v1/medicos");
    }

    crearReserva(reserva: CreateReservaAdminDTO): Observable<{ id: number }> {
        return this.httpClient.post<{ id: number }>("/api/v1/admin/reservas", reserva);
    }

    cancelarTurno(idReserva: number): Observable<void> {
        return this.httpClient.patch<void>(`/api/v1/admin/reservas/${idReserva}/cancelar`, {});
    }

    modificarValorConsulta(idMedico: number, valorConsulta: number): Observable<void> {
        return this.httpClient.patch<void>(`/api/v1/admin/medicos/${idMedico}/valor-consulta`, { valor_consulta: valorConsulta });
    }

}
