import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  // Vérifie la santé de l'application
  async checkHealth() {
    try {
      // Tester la connexion à la base de données
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
          database: 'Connected',
          api: 'Running',
          memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
        },
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'Disconnected',
          api: 'Partial',
        },
        error: error.message,
      };
    }
  }
}
