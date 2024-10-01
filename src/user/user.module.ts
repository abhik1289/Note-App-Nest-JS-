import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryConfigService } from './cloudinary.config';
// import { CloudinaryConfigService } from 'src/user/cloudinary.config';

@Module({
  exports:[UserService],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserService,CloudinaryConfigService],
  controllers: [UserController]
})
export class UserModule {}
