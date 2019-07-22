import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { SessionAuthGuard } from './auth/session-auth-guard';
import { SessionGuard } from './auth/session-guard';

@Controller('api')
export class AppController {
    @UseGuards(SessionAuthGuard)
    @Post('login')
    public async login(@Body() body, @Req() req) {
        return 'login';
    }

    @UseGuards(SessionGuard)
    @Get('me')
    public getProfile(@Request() req) {
        return req.user;
    }
}
