import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  verifyToken: string;

  @Prop()
  verifyTokenExpiry: Date;

  @Prop({ required: false }) 
  profile_photo?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
