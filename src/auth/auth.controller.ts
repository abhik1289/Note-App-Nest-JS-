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
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-login.dto';
import { Response } from 'express';
import { AuthGuard } from './auth.guard'; // Assuming you have an AuthGuard
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('profile')
  @UseGuards(AuthGuard)
  async profile(@Request() req) {
    return this.userService.findById(req.user);
  }
  @Get(':token')
  async verifyAccount(@Param('token') token: string) {
    try {
      return await this.authService.verifyAccount(token);
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const { access_token } = await this.authService.SignIn(loginDto);
      response.cookie('jwt', access_token, {
        httpOnly: true,
        maxAge: 3600000,
      });
      return { message: 'Logged in successfully' };
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return { message: 'Logged out successfully' };
  }
}
