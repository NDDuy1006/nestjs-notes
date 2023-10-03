import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDto, SigninDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(authDto: AuthDto) {
    const hashedPassword = await argon.hash(authDto.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: authDto.email,
          hashedPassword: hashedPassword,
          firstname: authDto.firstname,
          lastname: authDto.lastname,
        },
        select: {
          id: true,
          email: true,
          firstname: true,
          lastname: true,
          createdAt: true,
        },
      });
      return await this.signJwtToken(user.id, user.email);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('This email already exists');
      }
    }
  }

  async signin(signinDto: SigninDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: signinDto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const passwordMatched = await argon.verify(
      user.hashedPassword,
      signinDto.password,
    );

    if (!passwordMatched) {
      throw new ForbiddenException('Incorrect password');
    }

    delete user.hashedPassword;

    return await this.signJwtToken(user.id, user.email);
  }

  async signJwtToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email: email,
    };

    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_SECRET'),
    });

    return {
      accessToken: jwtString,
    };
  }
}
