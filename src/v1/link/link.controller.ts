import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LinkService } from './link.service';
import { AuthGuard } from '@nestjs/passport';
import {
  changeStatusLinkDto,
  createLinkDto,
  deleteLinkDto,
  updateLinkDto,
} from '../dto/link.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('api/v1/link')
@UseGuards(ThrottlerGuard, AuthGuard('jwt')) // Appliqué à TOUTES les routes
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get('all')
  async getAllLinks(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.linkService.getAllLinksForUser(userId);
  }

  @Post('create')
  async createLink(
    @Body() body: createLinkDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    return this.linkService.createLink({
      ...body,
      userId,
    });
  }

  @Put('update')
  async updateLink(
    @Body() body: updateLinkDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    return this.linkService.updateLink({
      ...body,
      userId,
    });
  }

  @Put('change-status')
  async changeStatusLink(
    @Body() body: changeStatusLinkDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    return this.linkService.changeStatusLink({
      ...body,
      userId,
    });
  }

  @Delete('delete')
  async deleteLink(
    @Body() body: deleteLinkDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId;

    return this.linkService.deleteLink({
      ...body,
      userId,
    });
  }
}
