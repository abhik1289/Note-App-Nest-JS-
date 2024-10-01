import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Find a user by email
   * @param email - User's email address
   * @returns User document if found, otherwise null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Create a new user
   * @param createUserDto - Data Transfer Object for creating a user
   * @returns The created user document
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash the user password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userData = { ...createUserDto, password: hashedPassword };

    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  /**
   * Find a user by ID
   * @param id - User ID
   * @returns User document if found
   * @throws NotFoundException if the user is not found
   */
  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Update user details
   * @param id - User ID
   * @param updateUserDto - Data Transfer Object for updating user
   * @returns Updated user document
   * @throws NotFoundException if the user is not found
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules are applied
      })
      .exec();

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return existingUser;
  }
  async delete(id: string): Promise<any> {
    const deleteUser = await this.userModel.findByIdAndDelete(id);
    if (!deleteUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      success: true,
      message: 'Successfully deleted',
    };
  }
}
