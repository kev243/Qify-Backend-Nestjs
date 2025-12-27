import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
// Service pour l'authentification via Google
export class GoogleAuthService {
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_IOS);

  // Vérifie le token d'identification Google et retourne les informations utilisateur
  async verifyIdToken(idToken: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID_IOS,
      });

      // Informations utilisateur extraites du token
      const payload = ticket.getPayload();

      if (!payload || !payload.email || !payload.sub || !payload.name) {
        throw new UnauthorizedException('Invalid Google token');
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch {
      throw new UnauthorizedException('Google token verification failed');
    }
  }
}
