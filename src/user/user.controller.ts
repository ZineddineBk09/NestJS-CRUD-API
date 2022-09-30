import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@Controller('users')
export class UserController {
  // make a GUARD to protect this route if the user is not logged in
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: any) {
    return user;
  }
}
