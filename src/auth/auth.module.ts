import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret:'jqdE7nYgpNIfmdIQzAqUmb7OtJ1lkUHl', // SECRET KEY - TEXT OR FILE
      signOptions: {
        expiresIn: '1h', // TOKEN EXPIRY TIME
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [PassportModule,AuthModule],
})
export class AuthModule {}
