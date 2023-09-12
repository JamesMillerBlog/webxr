import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UpdateUserDto, UserDto } from './user.dto';
import { User } from '@shared/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
  @Get(':uid')
  async findOne(@Param('uid') uid: string): Promise<User> {
    return this.userService.findOne({ uid });
  }

  @Post()
  async create(@Body() userDto: UserDto): Promise<User> {
    return this.userService.create(userDto);
  }

  @Put(':uid')
  async update(
    @Param('uid') uid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User | string> {
    return this.userService.update({ uid }, updateUserDto);
  }

  @Delete(':uid')
  async delete(@Param('uid') uid: string): Promise<string> {
    return this.userService.delete({ uid });
  }
}
