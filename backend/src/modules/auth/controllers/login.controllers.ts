import { Body, Controller, NotImplementedException, Post } from "@nestjs/common";
import { LoginDTO } from "../dtos/input/login.dto.js";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "../services/auth.service.js";

@Controller("/auth")
export class LoginController {

    constructor(private readonly authS: AuthService) { }

    @ApiBearerAuth()
    @Post()
    async login(@Body() dto: LoginDTO): Promise<{ accessToken: string }> {
        return await this.authS.login(dto)
    }

}