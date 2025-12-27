import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  createUsernameDto,
  updateStatusDto,
  updateUsernameDto,
} from '../dto/profile.dto';
import { generateSlug } from 'utils/generate-slug';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  // Récupère le profil par userId
  async getProfileByUserId(userId: string) {
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { userId: userId },
        select: {
          username: true,
          bio: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              email: true,
              urlProfile: true,
            },
          },
        },
      });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      return {
        status: 'success',
        profile,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to get profile');
    }
  }

  async getProfile(username: string) {
    try {
      const slug = generateSlug(username.trim().toLowerCase());

      const profile = await this.prisma.profile.findUnique({
        where: { username: slug },
        select: {
          username: true,
          bio: true,
          status: true,
          createdAt: true,
        },
      });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      return {
        status: 'success',
        profile,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create username');
    }
  }

  // Création du username
  async createUsername(data: createUsernameDto) {
    try {
      // Nettoyage et validation du username
      const cleanUsername = data.username.trim().toLowerCase(); // Supprimer les espaces et mettre en minuscules

      const slug = generateSlug(cleanUsername);

      const usernameExists = await this.prisma.profile.findUnique({
        where: { username: slug },
      });

      if (usernameExists) {
        throw new ConflictException('Username already taken');
      }

      // Créeation du  profil
      const profile = await this.prisma.profile.create({
        data: {
          username: slug,
          userId: data.userId,
        },
      });

      return {
        status: 'success',
        message: 'Username created successfully',
        username: profile.username,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create username');
    }
  }

  // Mise à jour du username
  async updateUsername(data: updateUsernameDto) {
    try {
      // Validation et nettoyage du username
      const cleanUsername = data.username.trim().toLowerCase();

      const slug = generateSlug(cleanUsername);

      // Vérifier que le profil existe pour cet utilisateur
      const existingProfile = await this.prisma.profile.findUnique({
        where: { userId: data.userId },
      });

      if (!existingProfile) {
        throw new BadRequestException('Profile not found');
      }

      // Vérifier que le nouveau username n'est pas déjà pris (sauf si c'est le même)
      if (existingProfile.username !== slug) {
        const usernameExists = await this.prisma.profile.findUnique({
          where: { username: slug },
        });

        if (usernameExists) {
          throw new ConflictException('Username already taken');
        }
      }

      // Mettre à jour le profil
      const updatedProfile = await this.prisma.profile.update({
        where: { userId: data.userId },
        data: { username: slug },
      });

      return {
        status: 'success',
        message: 'Username updated successfully',
        username: updatedProfile.username,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update username');
    }
  }

  // Mise à jour du statut du profil (public/privé)
  async updateStatus(data: updateStatusDto) {
    try {
      // Vérifie  que le profil existe pour cet utilisateur
      const existingProfile = await this.prisma.profile.findUnique({
        where: { userId: data.userId },
      });

      if (!existingProfile) {
        throw new BadRequestException('Profile not found');
      }

      // Met à jour le statut
      const updatedProfile = await this.prisma.profile.update({
        where: { userId: data.userId },
        data: { status: data.status },
      });

      return {
        status: 'success',
        message: 'Profile status updated successfully',
        profileStatus: updatedProfile.status,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update profile status');
    }
  }
}
