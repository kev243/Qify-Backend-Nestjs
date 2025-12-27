import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Post('google')
  async googleLogin(@Body('idToken') idToken: string) {
    const googleUser = await this.googleAuthService.verifyIdToken(idToken);

    const jwt = await this.authService.loginWithGoogle({
      email: googleUser.email,
      googleId: googleUser.googleId,
      name: googleUser.name,
      picture: googleUser.picture,
    });

    return { accessToken: jwt };
  }
}
