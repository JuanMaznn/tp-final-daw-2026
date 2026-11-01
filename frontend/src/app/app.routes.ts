import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { AgendaMedico } from './medico/agenda/agenda-medico';
import { AdminTurnos } from './admin/turnos/admin-turnos';
import { TurnosListado } from './paciente/turnos/listado/turnos-listado';

export const routes: Routes = [
    { path: "login", component: Login },
    { path: "turnos", component: TurnosListado },
    { path: "agenda", component: AgendaMedico },
    { path: "admin", component: AdminTurnos },
    { path: "**", redirectTo: "login" }
];
