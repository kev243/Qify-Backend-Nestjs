import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  // Récupérer le profil public par username
  async getPublicProfile(username: string) {
    try {
      // Nettoyage de  username
      const cleanUsername = username.trim().toLowerCase();

      // Récupération du profil avec ses liens
      const profile = await this.prisma.profile.findUnique({
        where: {
          username: cleanUsername,
        },
        include: {
          user: {
            select: {
              name: true,
              urlProfile: true,
              links: {
                where: {
                  status: true, // Seulement les liens actifs
                },
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  url: true,
                  description: true,
                  createdAt: true,
                },
                orderBy: {
                  createdAt: 'desc', // Du plus récent au plus ancien
                },
              },
            },
          },
        },
      });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      if (!profile.status) {
        throw new NotFoundException('This profile is private');
      }

      return {
        status: 'success',
        data: {
          profile: {
            username: profile.username,
            bio: profile.bio,
            createdAt: profile.createdAt,
          },
          user: {
            name: profile.user.name,
            urlProfile: profile.user.urlProfile,
          },
          links: profile.user.links,
          linksCount: profile.user.links.length,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Failed to fetch profile');
    }
  }
}
