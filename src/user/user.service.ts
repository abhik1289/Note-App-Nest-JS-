import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryConfigService } from './cloudinary.config';
// import { CloudinaryConfigService } from 'src/user/cloudinary.config';
// import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly mailService: MailerService,
    private jwtService: JwtService,
    private readonly cloudinaryConfigService: CloudinaryConfigService,
    // private readonly cloudinaryConfigService: CloudinaryConfigService,
  ) {}
  //

  async uploadImageToCloudinary(file: Express.Multer.File) {
    return this.cloudinaryConfigService.uploadImage(file);
  }
  /**
   * Find a user by email
   * @param email - User's email address
   * @returns User document if found, otherwise null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /**
   * Create a new user and send a welcome email
   * @param createUserDto - Data Transfer Object for creating a user
   * @returns The created user document
   * @throws ConflictException if a user with the given email already exists
   */
  private async sendWelcomeEmail(
    name: string,
    email: string,
    verificationToken: string,
  ): Promise<void> {
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: 'Welcome to Our App!',
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd;">
        <h2 style="color: #333;">Welcome to Our Platform, ${name}!</h2>
        <p>Thank you for registering with us. To activate your account, please verify your email address by clicking the link below:</p>
        <div style="margin: 20px 0; text-align: center;">
          <a href="${process.env.CLIENT_URL}?token=${verificationToken}" style="padding: 10px 15px; background: #0284c7; color: white; text-decoration: none; border-radius: 5px;">
            Click Here to Verify Your Email
          </a>
        </div>
        <p>If you did not sign up for this account, please disregard this email or <a href="https://yourapp.com/support" style="color: #0284c7;">contact support</a>.</p>
        <p>Regards,</p>
        <p><strong>Your App Team</strong></p>
      </div>
    `,
    };

    await this.mailService.sendMail(mailOptions);
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password } = createUserDto;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const payload: any = { userId: savedUser._id };
    const token = this.jwtService.sign(payload);

    //  / Replace with your token generation logic
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // Set expiry for 1 hour from now

    // Assign the token and expiry to the user
    newUser.verifyToken = token;
    newUser.verifyTokenExpiry = tokenExpiry;
    await newUser.save();

    await this.sendWelcomeEmail(name, email, token);

    return savedUser;
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
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  /**
   * Delete a user by ID
   * @param id - User ID
   * @returns Success message if deletion is successful
   * @throws NotFoundException if the user is not found
   */
  async delete(id: string): Promise<{ success: boolean; message: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { success: true, message: 'User successfully deleted' };
  }

  /**
   * Send a welcome email to a new user
   * @param name - User's name
   * @param email - User's email address
   * @returns void
   */

  async updateProfilePhoto(id: ObjectId, profile_photo: string) {
    const update = await this.userModel.findByIdAndUpdate(
      id,
      {
        profile_photo,
      },
      { new: true, runValidators: true },
    );
    return update;
  }
}
