import { ProfileService } from './profile.service';
import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  Put,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  createUsernameDto,
  updateStatusDto,
  updateUsernameDto,
} from '../dto/profile.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

//TODO: ajouter une clé API pour sécuriser les endpoints publics
@Controller('api/v1/profile')
@UseGuards(ThrottlerGuard, AuthGuard('jwt')) // Appliqué à TOUTES les routes
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('my-profile')
  async getMyProfile(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.profileService.getProfileByUserId(userId);
  }

  @Get(':username')
  async getProfile(@Param('username') username: string) {
    return this.profileService.getProfile(username);
  }

  @Post('create-username')
  async createUsername(
    @Body() body: createUsernameDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    return this.profileService.createUsername({
      ...body,
      userId,
    });
  }

  @Put('update-username')
  async updateUsername(
    @Body() body: updateUsernameDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    return this.profileService.updateUsername({
      ...body,
      userId,
    });
  }

  @Put('update-status')
  // Mettre à jour le statut du profil (public/privé)
  async updateStatus(
    @Body() body: updateStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;
    return this.profileService.updateStatus({
      ...body,
      userId,
    });
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('me')
  // async getMyProfile(@Req() req: any) {
  //   // Optionnel : méthode pour récupérer le profil de l'utilisateur connecté
  //   const userId = req.user.userId;
  //   // Logique pour récupérer le profil
  // }
}
