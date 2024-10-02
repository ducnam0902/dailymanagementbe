import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateRequestContext, EntityManager } from '@mikro-orm/postgresql';
import { UserEntity } from './user.entity';

import { CreateUserDto } from './dto/CreateUserDto';
import { LoginUserDto } from './dto/LoginUser.dto';

import { JwtToken, UserResponse } from './types/UserResponse.interface';
import { UserLogoutStatus } from './types/UserType';
@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private readonly em: EntityManager,
  ) {}
  @CreateRequestContext()
  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<UserResponse, 'accessToken' | 'refreshToken'>> {
    const newUser = new UserEntity();

    const user = await this.em.findOne(UserEntity,{
      email: createUserDto.email,
    });

    if (!user) {
      Object.assign(newUser, createUserDto);
      await this.em.persistAndFlush(newUser);
      return newUser;
    } else {
      throw new ConflictException({
        email: 'Email has already exists',
      });
    }
  }
  @CreateRequestContext()
  async loginUser(loginUserDto: LoginUserDto): Promise<UserResponse> {
    const user = await this.em.findOne(UserEntity, {
      email: loginUserDto.email,
    });

    if (!user) {
      throw new UnauthorizedException({
        email: 'Invalid email or password',
      });
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException({
        password: 'Invalid password',
      });
    }
    const token = await this.generateJwt(user);
    user.refreshToken = token.refreshToken;
    await this.em.persistAndFlush(user);
    return {
      ...user,
      ...token,
    };
  }

  async generateJwt(user: UserEntity): Promise<JwtToken> {
    const jwtPayload = {
      id: user.id,
      email: user.email,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        expiresIn: process.env.ACCESS_KEY_EXPIRATION,
        secret: process.env.ACCESS_KEY_SECRET,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_KEY_EXPIRATION,
        expiresIn: process.env.REFRESH_KEY_EXPIRATION,
      }),
    ]);
    return { accessToken, refreshToken };
  }
  @CreateRequestContext()
  async refreshToken(token: string): Promise<JwtToken> {
    const user = await this.em.findOne(UserEntity,{
      refreshToken: token,
    });

    if (!user || !token) {
      throw new ForbiddenException({
        message: 'Forbidden',
      });
    }

    const verifyUser = await this.jwtService.verifyAsync(token, {
      secret: process.env.REFRESH_KEY_EXPIRATION,
    });

    if (verifyUser.id !== user.id) {
      throw new ForbiddenException({
        message: 'Forbidden',
      });
    }

    const newToken = await this.generateJwt(user);
    user.refreshToken = newToken.refreshToken;
    await this.em.persistAndFlush(user);
    return newToken;
  }

  @CreateRequestContext()
  async logoutUser(userId: string): Promise<UserLogoutStatus> {
    const user = await this.em.findOne(UserEntity,{
      id: userId,
    }, {
      populate: ['notes']
    });

    if (!user) {
      throw new ForbiddenException({
        message: 'Forbidden',
      });
    }
    const newUserDto = this.em.create(UserEntity, { ...user, refreshToken: '' });
    await this.em.persist(newUserDto).flush();
    return {
      ok: true,
    };
  }

  @CreateRequestContext()
  async getCurrentUser(currentUserId: string): Promise<UserEntity> {
    const users = await this.em.findOne(UserEntity,{
      id: currentUserId,
    });
    return users;
  }
}
