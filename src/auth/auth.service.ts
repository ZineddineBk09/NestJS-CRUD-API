import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // hash the password
    const hash = await argon.hash(dto.password);

    try {
      // create the user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // remove the hash from the user object before returning
      delete user.hash;

      // return the user
      return user;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 is a unique constraint violation
        if (err.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw err;
    }
  }

  async signin(dto: AuthDto) {
    // find the user
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user does not exist, throw an error
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    // if user exists, compare the password
    const pwMatches = await argon.verify(user.hash, dto.password);

    // if password is incorrect, throw an error
    if (!pwMatches) {
      throw new ForbiddenException('Invalid credentials');
    }

    // remove the hash from the user object before returning
    delete user.hash;

    // if password is correct, return the user
    return user;
  }
}
