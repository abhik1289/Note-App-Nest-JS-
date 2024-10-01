import {
  Body,
  Controller,
  HttpStatus,
  Post,
  ConflictException,
  InternalServerErrorException,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user
   * @param createUserDto - Data Transfer Object for creating a user
   * @returns The created user object with a success message and HTTP status
   * @throws ConflictException if the user already exists
   * @throws InternalServerErrorException for unexpected errors
   */
  //   This is create user controller
  @Post('create-user')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    // Check if a user with the given email already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    try {
      // Create a new user if the email is not taken
      const createdUser = await this.userService.create(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully.',
        data: createdUser,
      };
    } catch (error) {
      // Enhanced error handling with custom message
      console.error(`Failed to create user: ${error.message}`);
      throw new InternalServerErrorException(
        'An unexpected error occurred during user creation.',
      );
    }
  }
  // get user by Id
  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      return this.userService.findById(id);
    } catch (error) {
      console.error(`Failed to create user: ${error.message}`);
      throw new InternalServerErrorException(
        'An unexpected error occurred during user creation.',
      );
    }
  }

  @Put(':id')
  async updateById(
    @Param('id') id: string,
    @Body() UpdateUserDto: UpdateUserDto,
  ) {
    try {
      const user = await this.userService.update(id, UpdateUserDto);
      return user;
    } catch (error) {
      console.error(`Failed to create user: ${error.message}`);
      throw new InternalServerErrorException(
        'An unexpected error occurred during user creation.',
      );
    }
  }

  @Delete(':id')
  async delete( @Param('id') id: string) {
    try {
      const info = await this.userService.delete(id);
      return info;
    } catch (error) {
      console.error(`Failed to create user: ${error.message}`);
      throw new InternalServerErrorException(
        'An unexpected error occurred during user creation.',
      );
    }
  }
}
