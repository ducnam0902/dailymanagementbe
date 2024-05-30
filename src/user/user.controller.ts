import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { CustomValidationResponse } from 'src/shared/pipes/CustomValidationResponse.pipe';
import { LoginUserDto } from './dto/LoginUser.dto';
import { UserCreatedSuccessResponse } from './types/UserCreatedSuccessResponse.interface';
import { LoginType } from './types/LoginType';
import { Response } from 'express';
import { Cookies } from './decorators/cookie.decorator';
import { User } from './decorators/user.decorator';
import { cookieOptions } from 'src/utils';
import { AuthGuard } from './guards/auth.guards';
import { UserType } from './types/UserType';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new CustomValidationResponse())
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserCreatedSuccessResponse> {
    return await this.userService.createUser(createUserDto);
  }

  @Post('/login')
  @UsePipes(new CustomValidationResponse())
  async loginUser(
    @Res({ passthrough: true }) response: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<LoginType> {
    const userToken = await this.userService.loginUser(loginUserDto);
    response.cookie('refreshToken', userToken.refreshToken, cookieOptions);
    return { accessToken: userToken.accessToken };
  }

  @Get('/refresh')
  async refreshToken(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginType> {
    const token = await this.userService.refreshToken(refreshToken);
    response.cookie('refreshToken', token.refreshToken, cookieOptions);
    return { accessToken: token.accessToken };
  }

  @Get('/logout')
  async logoutUser(
    @User('id') currentUserId: number,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserCreatedSuccessResponse> {
    const logoutStatus = await this.userService.logoutUser(currentUserId);
    response.clearCookie('refreshToken', cookieOptions);
    return logoutStatus;
  }

  @Get('/currentUser')
  @UseGuards(AuthGuard)
  async getCurrentUser(@User('id') currentUserId: number): Promise<UserType> {
    const user = await this.userService.getCurrentUser(currentUserId);
    delete user.refreshToken;
    return user;
  }
}
