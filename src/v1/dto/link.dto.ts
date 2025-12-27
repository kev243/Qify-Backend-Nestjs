import { Optional } from '@nestjs/common';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class createLinkDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(20, { message: 'Title must be at most 20 characters long' })
  title: string;

  @IsString({ message: 'URL must be a string' })
  @IsNotEmpty({ message: 'URL is required' })
  @MinLength(10, { message: 'URL must be at least 10 characters long' })
  @MaxLength(300, { message: 'URL must be at most 300 characters long' })
  url: string;

  userId: string;
}

export class updateLinkDto {
  @IsString({ message: 'Link ID must be a string' })
  @IsNotEmpty({ message: 'Link ID is required' })
  linkId: string;

  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(20, { message: 'Title must be at most 20 characters long' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(300, {
    message: 'Description must be at most 300 characters long',
  })
  description?: string;

  @IsString({ message: 'URL must be a string' })
  @IsNotEmpty({ message: 'URL is required' })
  @MinLength(10, { message: 'URL must be at least 10 characters long' })
  @MaxLength(300, { message: 'URL must be at most 300 characters long' })
  url: string;

  userId: string;
}

export class changeStatusLinkDto {
  @IsString({ message: 'Link ID must be a string' })
  @IsNotEmpty({ message: 'Link ID is required' })
  linkId: string;

  @IsNotEmpty({ message: 'Status is required' })
  @IsBoolean({ message: 'Status must be a boolean value' })
  status: boolean;

  userId: string;
}

export class deleteLinkDto {
  @IsString({ message: 'Link ID must be a string' })
  @IsNotEmpty({ message: 'Link ID is required' })
  linkId: string;

  userId: string;
}
