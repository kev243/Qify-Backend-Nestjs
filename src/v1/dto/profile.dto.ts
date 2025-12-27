import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class createUsernameDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(10, { message: 'Username must be at most 10 characters long' })
  username: string;

  userId: string;
}

export class updateUsernameDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username must be at most 20 characters long' })
  username: string;

  userId?: string; // Ajouté par le contrôleur
}

export class updateStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsBoolean({ message: 'Status must be a boolean value' })
  status: boolean;

  userId?: string; // Ajouté par le contrôleur
}
