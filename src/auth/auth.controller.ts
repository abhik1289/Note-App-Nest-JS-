import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
  Body,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-login.dto';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':token')
  verifyAccount(@Param('token') token: string) {
    return this.authService.verifyAccount(token);
  }
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token } = await this.authService.SignIn(loginDto);
    // Set cookie
    response.cookie('jwt', access_token, {
      httpOnly: true, // Prevents client-side access to the cookie
      maxAge: 3600000, // 1 hour in milliseconds
    });

    return { message: 'Logged in successfully' };
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    // Clear the cookie
    response.clearCookie('jwt');

    return { message: 'Logged out successfully' };

  }

  
  @Get()
  getUser(){

  }

}
