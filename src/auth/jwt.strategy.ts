// import { PassportStrategy } from "@nestjs/passport";
// // import { InjectRepository } from "@nestjs/typeorm";
// import { ExtractJwt, Strategy } from "passport-jwt";
// // import { User } from "./user.entity";
// // import { Repository } from "typeorm";
// // import { JwtPayload } from "./jwt-payload.interface";
// import { UnauthorizedException } from "@nestjs/common";

// export class JwtStrategy extends PassportStrategy(Strategy) {
//     constructor(
     
//     ) {
//         super({
//             secretOrKey: 'topSecret92',
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//         });
//     }

//     async validate(payload: JwtPayload): Promise<any> {
//         const { username } = payload;
//         const user: User = await this.userRepository.findOne({select: ["id", "username", "password"], where: {username}});

//         if(!user) {
//             throw new UnauthorizedException();
//         }

//         return user;
//     }
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
//   import { jwtConstants } from './constants';
  import { Request } from 'express';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      console.log(token);
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(
          token,
          {
            secret: process.env.secret
          }
        );
        // 💡 We're assigning the payload to the request object here
        // so that we can access it in our route handlers
        request['user'] = payload;
      } catch {
        throw new UnauthorizedException();
      }
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
// }
