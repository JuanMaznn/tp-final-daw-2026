import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateReservaDTO } from "./create-reserva-dto";
import { ListMedicoDTO } from "./list-medico-dto";

@Injectable({
    providedIn: "root"
})
export class ReservarTurnoApiClient {

    private readonly httpClient: HttpClient = inject(HttpClient);

    buscarMedicos(): Observable<ListMedicoDTO[]> {
        return this.httpClient.get<ListMedicoDTO[]>("/api/v1/medicos");
    }

    crearReserva(reserva: CreateReservaDTO): Observable<{ id: number }> {
        return this.httpClient.post<{ id: number }>("/api/v1/usuario", reserva);
    }

}
