import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  UsePipes,
  BadRequestException,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUserDto';
import { CustomValidationResponse } from 'src/shared/pipes/CustomValidationResponse.pipe';
import { LoginUserDto } from './dto/LoginUser.dto';
import {
  JwtToken,
  RefreshToken,
  UserResponse,
} from './types/UserResponse.interface';
import { Response } from 'express';
import { User } from './decorators/user.decorator';
import { cookieOptions, ResponseCreatedData } from 'src/utils';
import { AuthGuard } from './guards/auth.guards';
import { UserLogoutStatus, UserType } from './types/UserType';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import envConfig from 'src/utils/config';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new CustomValidationResponse())
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseCreatedData> {
    const response = await this.userService.createUser(createUserDto);
    return {
      ok: !!response.id,
    };
  }

  @Post('/login')
  @UsePipes(new CustomValidationResponse())
  async loginUser(
    @Res({ passthrough: true }) response: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<UserResponse> {
    const userToken = await this.userService.loginUser(loginUserDto);
    response.cookie('refreshToken', userToken.refreshToken, cookieOptions);
    return userToken;
  }

  @Post('/refresh')
  async refreshToken(
    @Body() body: RefreshToken,
    @Res({ passthrough: true }) response: Response,
  ): Promise<JwtToken> {
    const token = await this.userService.refreshToken(body.refreshToken);
    response.cookie('refreshToken', token.refreshToken, cookieOptions);
    return { accessToken: token.accessToken, refreshToken: token.refreshToken };
  }

  @Get('/logout')
  async logoutUser(
    @User('id') currentUserId: number,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserLogoutStatus> {
    const result = await this.userService.logoutUser(currentUserId);
    response.clearCookie('refreshToken', cookieOptions);
    return result;
  }

  @Get('/currentUser')
  @UseGuards(AuthGuard)
  async getCurrentUser(@User('id') currentUserId: number): Promise<UserType> {
    const user = await this.userService.getCurrentUser(currentUserId);
    delete user.refreshToken;
    return user;
  }

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(null, false);
        }
        callback(null, true);
      },
    }),
  )
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not an image');
    } else {
      const response = {
        filePath: `${envConfig.PUBLIC_API_ENDPOINT}/user/image/${file.filename}`,
      };
      return response;
    }
  }

  @Get('image/:filename')
  async getPicture(@Param('filename') filename, @Res() res: Response) {
    res.sendFile(filename, {
      root: './uploads',
    });
  }
}
