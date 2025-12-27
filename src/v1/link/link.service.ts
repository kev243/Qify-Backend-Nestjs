import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  changeStatusLinkDto,
  createLinkDto,
  deleteLinkDto,
  updateLinkDto,
} from '../dto/link.dto';
import { generateSlug } from '../../../utils/generate-slug';

@Injectable()
export class LinkService {
  constructor(private readonly prisma: PrismaService) {}

  // Récupère tous les liens pour un utilisateur donné
  async getAllLinksForUser(userId: string) {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      const links = await this.prisma.link.findMany({
        where: { userId },
      });
      return { status: 'success', links };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to get links');
    }
  }

  // Crée un nouveau lien
  async createLink(data: createLinkDto) {
    try {
      const slug = generateSlug(data.title);
      const link = await this.prisma.link.create({
        data: {
          title: data.title,
          slug: slug,
          url: data.url,
          userId: data.userId,
        },
      });

      return { status: 'success', message: 'Link created successfully', link };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to create link');
    }
  }

  // Met à jour un lien existant
  async updateLink(data: updateLinkDto) {
    try {
      // Vérifie que le lien existe et appartient à l'utilisateur
      const existingLink = await this.prisma.link.findFirst({
        where: {
          id: data.linkId,
          userId: data.userId,
        },
      });

      if (!existingLink) {
        throw new BadRequestException(
          'Link not found or you do not have permission to update it',
        );
      }

      const slug = generateSlug(data.title);

      const link = await this.prisma.link.update({
        where: { id: data.linkId },
        data: {
          title: data.title,
          slug: slug,
          description: data.description,
          url: data.url,
        },
      });

      return { status: 'success', message: 'Link updated successfully', link };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update link');
    }
  }

  // Mettre à jour le statut (actif/inactif) d'un lien
  async changeStatusLink(data: changeStatusLinkDto) {
    try {
      // Vérifie que le lien existe et appartient à l'utilisateur
      const existingLink = await this.prisma.link.findFirst({
        where: {
          id: data.linkId,
          userId: data.userId,
        },
      });

      if (!existingLink) {
        throw new BadRequestException(
          'Link not found or you do not have permission to change its status',
        );
      }

      const link = await this.prisma.link.update({
        where: { id: data.linkId },
        data: {
          status: data.status,
        },
      });
      return {
        status: 'success',
        message: 'Link status changed successfully',
        link,
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to change link status');
    }
  }

  // Supprimer un lien
  async deleteLink(data: deleteLinkDto) {
    try {
      // Vérifie que le lien existe et appartient à l'utilisateur
      const existingLink = await this.prisma.link.findFirst({
        where: {
          id: data.linkId,
          userId: data.userId,
        },
      });

      if (!existingLink) {
        throw new BadRequestException(
          'Link not found or you do not have permission to delete it',
        );
      }

      // Supprime le lien
      await this.prisma.link.delete({
        where: { id: data.linkId },
      });

      return { status: 'success', message: 'Link deleted successfully' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to delete link');
    }
  }
}
