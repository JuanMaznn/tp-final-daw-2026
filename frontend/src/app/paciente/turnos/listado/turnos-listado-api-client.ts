import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ListReservaDTO } from "./list-reserva-dto";

@Injectable({
    providedIn: "root"
})
export class TurnosListadoApiClient {

    private readonly httpClient: HttpClient = inject(HttpClient);

    buscarTurnos(idUsuario: number): Observable<ListReservaDTO[]> {
        return this.httpClient.get<ListReservaDTO[]>(`/api/v1/usuario/${idUsuario}/reservas`);
    }

    cancelarTurno(idReserva: number): Observable<void> {
        return this.httpClient.patch<void>(`/api/v1/usuario/${idReserva}/cancelar`, {});
    }

}
