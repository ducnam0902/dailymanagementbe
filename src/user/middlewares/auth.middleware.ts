import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../types/expressRequest.interface';

import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    if (!req.get('authorization')) {
      req.user = null;
      next();
      return;
    }
    const token = req.get('authorization').split(' ')[1];
    try {
      const decode = await this.jwtService.verify(token, {
        secret: this.configService.get('ACCESS_KEY_SECRET'),
        ignoreExpiration: false,
      });
      const user = await this.userService.getCurrentUser(decode.id);
      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
