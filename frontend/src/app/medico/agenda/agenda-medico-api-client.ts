import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ListReservaDTO } from "../../paciente/turnos/listado/list-reserva-dto";
import { ListMedicoDTO } from "../../paciente/turnos/gestion/list-medico-dto";

@Injectable({
    providedIn: "root"
})
export class AgendaMedicoApiClient {

    private readonly httpClient: HttpClient = inject(HttpClient);

    buscarMedicos(): Observable<ListMedicoDTO[]> {
        return this.httpClient.get<ListMedicoDTO[]>("/api/v1/medicos");
    }

    buscarTurnosPorFecha(idMedico: number, fecha: string): Observable<ListReservaDTO[]> {
        const params: HttpParams = new HttpParams().set("fecha", fecha);
        return this.httpClient.get<ListReservaDTO[]>(`/api/v1/medicos/${idMedico}/reserva`, { params });
    }

    cambiarEstado(idReserva: number, estado: "ATENDIDO" | "AUSENTE"): Observable<void> {
        return this.httpClient.patch<void>(`/api/v1/medicos/${idReserva}/estado`, { estado });
    }

}
