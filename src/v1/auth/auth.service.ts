import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginWithGoogleDto } from '../dto/auth.dto';
import { extractUsernameFromEmail } from 'utils/extract-username';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  // Fonction pour gérer la connexion via Google
  async loginWithGoogle(data: LoginWithGoogleDto) {
    try {
      // On verifie si l'utilisateur existe déjà
      let user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!user) {
        const username = extractUsernameFromEmail(data.email); // Extrait le nom dans l'email avant le @

        // Création avec relation nested (transaction automatique)
        user = await this.prisma.user.create({
          data: {
            email: data.email,
            name: data.name,
            urlProfile: data.picture,
            provider: 'google',
            providerId: data.googleId,
            profile: {
              create: {
                username: username,
              },
            },
          },
          include: {
            profile: true, // Inclure le profil créé
          },
        });
      }

      // On génère et retourne le token JWT
      return this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name,
        apiVersion: 'v1',
      });
    } catch (error) {
      throw error;
    }
  }
}
