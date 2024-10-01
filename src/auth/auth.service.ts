import { MailerService } from '@nestjs-modules/mailer';
import {
  Get,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { find } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/create-login.dto';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from './auth.guard';
// import { AuthGuard } from '@nestjs/passport';
// import { AuthGuard } from './auth.guard';
@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailerService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async verifyAccount(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: process.env.secret,
    });
    console.log(payload);
    const user: any = await this.userService.findById(payload.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();
    return {
      success: true,
      message: 'Verification successful',
    };
  }

  async SignIn(loginDto: LoginDto) {
    const { password, email } = loginDto;
    const isExits: any = await this.userService.findByEmail(email);
    if (!isExits) {
      throw new NotFoundException('User not found');
    }
    const isValid = await bcrypt.compare(password, isExits.password);
    if (!isValid) {
      throw new NotFoundException('Invalid credentials');
    }
    const payload = {
      userId: isExits._id,
    };
    const token = await this.jwtService.signAsync(payload);
    console.log('token: ' + token);
    return {
      access_token: token,
    };
  }
}
