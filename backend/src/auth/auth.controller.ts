import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(
        private authService:AuthService
    ) {}
    @Post('login')
    async login(@Body() payload: any) {
        const {expiry, ...authPayload}=payload
        return this.authService.login(authPayload, expiry);
    }
}