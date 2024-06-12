import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { DataSource, Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { CreateUserDto } from './dto/CreateUserDto';
import { LoginUserDto } from './dto/LoginUser.dto';
import { ConfigService } from '@nestjs/config';
import { JwtToken, UserResponse } from './types/userResponse.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserResponse> {
    const user = await this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: loginUserDto.email })
      .addSelect('user.password')
      .getOne();

    if (!user) {
      throw new UnauthorizedException({
        errors: { email: 'Invalid email or password' },
      });
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException({
        errors: { email: 'Invalid email or password' },
      });
    }
    const token = await this.generateJwt(user);
    user.refreshToken = token.refreshToken;
    const data = await this.userRepository.save(user);

    return {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      image: data.image,
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
        expiresIn: '1h',
        secret: this.configService.get('ACCESS_KEY'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('REFRESH_KEY'),
        expiresIn: '1d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshToken(token: string): Promise<JwtToken> {
    const user = await this.userRepository.findOne({
      where: { refreshToken: token },
    });

    if (!user || !token) {
      throw new ForbiddenException({
        errors: {
          message: 'Forbidden',
        },
      });
    }

    const verifyUser = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('REFRESH_KEY'),
    });

    if (verifyUser.id !== user.id) {
      throw new ForbiddenException({
        errors: {
          message: 'Forbidden',
        },
      });
    }

    const newToken = await this.generateJwt(user);
    user.refreshToken = newToken.refreshToken;
    await this.userRepository.save(user);
    return newToken;
  }

  async logoutUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new ForbiddenException({
        errors: {
          message: 'Forbidden',
        },
      });
    }
    const newUser = { ...user, refreshToken: '' };
    await this.userRepository.save(newUser);
  }

  async getCurrentUser(currentUserId: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id: currentUserId },
    });
  }
}
