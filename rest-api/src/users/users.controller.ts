import {
  Controller,
  Post,
  Body,
  Session,
  Get,
  UseGuards,
} from '@nestjs/common';

import { RegisterUserDTO } from './dtos/register-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDTO } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dtos/login-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
  constructor(private authService: AuthService) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async registerUser(@Body() body: RegisterUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async loginUser(@Body() body: LoginUserDTO, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }
}
