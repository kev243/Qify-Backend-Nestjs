import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PublicService } from './public.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiKeyGuard } from '../guard/apikey.guard';

@Controller('api/v1/public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @UseGuards(ThrottlerGuard, ApiKeyGuard)
  @Get('profile/:username')
  async getPublicProfile(@Param('username') username: string) {
    return this.publicService.getPublicProfile(username);
  }
}
