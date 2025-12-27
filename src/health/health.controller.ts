import { Controller, Get, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { HealthService } from './health.service';

@Controller('api')
@UseGuards(ThrottlerGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  async checkHealth() {
    return this.healthService.checkHealth();
  }
}
