import { IsEmail, IsString, IsOptional, MinLength } from 'class-validator';

// CreateUserDto for defining new user details
export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// UpdateUserDto for handling user updates (fields are optional)
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  verifyToken?: string;

  @IsOptional()
  verifyTokenExpiry?: Date;
}
