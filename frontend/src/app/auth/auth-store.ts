import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: "root"
})
export class AuthStore {

    private readonly router: Router = inject(Router);

    guardarToken(token: string): void {
        sessionStorage.setItem("accessToken", token);
    }

    obtenerToken(): string | null {
        return sessionStorage.getItem("accessToken");
    }

    // El token JWT tiene 3 partes separadas por "." (header.payload.firma).
    // El payload (la del medio) guarda { nombres, sub }, y "sub" es el id del usuario.
    obtenerIdUsuario(): number | null {
        return this.leerPayload()?.sub ?? null;
    }

    // El payload también guarda "rol" (PACIENTE, MEDICO o ADMINISTRADOR).
    obtenerRol(): string | null {
        return this.leerPayload()?.rol ?? null;
    }

    private leerPayload(): { nombres: string; sub: number; rol: string } | null {
        const token: string | null = this.obtenerToken();
        if (!token) {
            return null;
        }
        const payloadBase64: string = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(payloadBase64));
    }

    cerrarSesion(): void {
        sessionStorage.removeItem("accessToken");
        this.router.navigateByUrl("/login");
    }

}
