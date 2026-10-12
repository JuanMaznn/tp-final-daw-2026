import { Body, Controller, NotImplementedException, Post } from "@nestjs/common";
import { LoginDTO } from "../dtos/input/login.dto.js";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("/auth")
export class LoginController {

    constructor() { }

    @ApiBearerAuth()
    @Post()
    async login(@Body() dto: LoginDTO): Promise<{ accessToken: string }> {
        throw new NotImplementedException();
    }

}