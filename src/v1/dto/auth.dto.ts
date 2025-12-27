import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// DTO pour la connexion avec Google
export class LoginWithGoogleDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsString({ message: 'Picture must be a string' })
  @Optional()
  picture?: string;

  @IsString({ message: 'Google ID must be a string' })
  @IsNotEmpty({ message: 'Google ID is required' })
  googleId: string;
}
