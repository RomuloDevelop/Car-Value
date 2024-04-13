import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth/auth.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    const result = this.authService.signup(body);

    if (result instanceof HttpException) throw result;

    return result;
  }

  @Post('signin')
  signin(@Body() body: CreateUserDto) {
    const result = this.authService.signin(body);

    if (result instanceof HttpException) throw result;

    return result;
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const result = await this.usersService.update(parseInt(id), body);

    if (result instanceof HttpException) throw result;

    return result;
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    const result = await this.usersService.remove(parseInt(id));

    if (result instanceof HttpException) throw result;

    return result;
  }
}
