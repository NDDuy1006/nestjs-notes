import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorators';
import { CustomJwtGuard } from '../auth/guard';

@Controller('users')
export class UserController {
  @UseGuards(CustomJwtGuard)
  @Get('me')
  getUser(@GetUser() user: User) {
    return user;
  }
}
