import {
  ConflictException,
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
import { JwtToken, UserResponse } from './types/UserResponse.interface';
import { UserLogoutStatus } from './types/UserType';
import { MailService } from 'src/mail/mail.service';
import envConfig from 'src/utils/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
    private jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async getCurrentUser(currentUserId: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id: currentUserId },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    const user = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (!user) {
      Object.assign(newUser, createUserDto);
      const data = await this.userRepository.insert(newUser);
      await this.mailService.sendEmailRegisterSuccessfully(newUser);
      return data.raw[0];
    } else {
      throw new ConflictException({
        email: 'Email has already exists',
      });
    }
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
    await this.userRepository.update(user.id, {
      refreshToken: token.refreshToken,
    });
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
        expiresIn: envConfig.ACCESS_KEY_EXPIRATION,
        secret: envConfig.ACCESS_KEY_SECRET,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: envConfig.REFRESH_KEY_EXPIRATION,
        expiresIn: envConfig.REFRESH_KEY_EXPIRATION,
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
        message: 'Forbidden',
      });
    }

    const verifyUser = await this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_KEY_EXPIRATION,
    });

    if (verifyUser.id !== user.id) {
      throw new ForbiddenException({
        message: 'Forbidden',
      });
    }

    const newToken = await this.generateJwt(user);
    await this.userRepository.update(user.id, {
      refreshToken: newToken.refreshToken,
    });
    return newToken;
  }

  async logoutUser(userId: number): Promise<UserLogoutStatus> {
    const user = await this.getCurrentUser(userId);

    if (!user) {
      throw new ForbiddenException({
        message: 'Forbidden',
      });
    }
    const newUser = { ...user, refreshToken: '' };
    await this.userRepository.update(user.id, newUser);
    return {
      ok: true,
    };
  }
}
