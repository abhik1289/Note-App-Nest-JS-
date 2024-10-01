import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[UserModule,PassportModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
