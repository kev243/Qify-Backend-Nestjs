import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { timingSafeEqual } from 'crypto';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);
  private readonly validApiKeys = [process.env.API_KEY].filter(Boolean); // Supprime les clés undefined/null

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.extractApiKeyFromHeader(request);

    if (!apiKey) {
      this.logger.warn(`Attempted access without API key from ${request.ip}`);
      throw new UnauthorizedException('No API key provided');
    }

    if (!this.validateApiKey(apiKey)) {
      this.logger.warn(
        `Attempted access with invalid API key from ${request.ip}: ${apiKey.substring(0, 8)}...`,
      );
      throw new UnauthorizedException('Invalid API key');
    }

    this.logger.log(`Access granted with valid API key from ${request.ip}`);
    return true;
  }

  private extractApiKeyFromHeader(request: Request): string | undefined {
    return request.headers['x-api-key'] as string;
  }

  private validateApiKey(providedKey: string): boolean {
    if (!providedKey || this.validApiKeys.length === 0) {
      return false;
    }

    // Comparaison sécurisée contre les attaques par timing
    return this.validApiKeys.some((validKey) => {
      if (!validKey) return false;

      try {
        const providedBuffer = Buffer.from(providedKey);
        const validBuffer = Buffer.from(validKey);

        // Les buffers doivent avoir la même taille pour timingSafeEqual
        if (providedBuffer.length !== validBuffer.length) {
          return false;
        }

        // Compare TOUJOURS tous les caractères, même si les premiers diffèrent
        // Le temps de réponse est constant, impossible de deviner la clé (Attaque par timing)
        return timingSafeEqual(providedBuffer, validBuffer);
      } catch {
        return false;
      }
    });
  }
}
