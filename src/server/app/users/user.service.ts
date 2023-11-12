import { Injectable } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { UpdateUserDto, UserDto, UserKeyDto } from './user.dto';
import { User, UserKey } from '@shared/types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User, UserKey>,
  ) {}

  async create(user: UserDto) {
    return this.userModel.create(user);
  }

  async update(key: UserKeyDto, userData: UpdateUserDto) {
    try {
      const user = await this.findOne(key);
      if (!user) throw new Error(`User '${key.uid}' does not exist`);
      return this.userModel.update(user, userData);
    } catch (e) {
      return String(e);
    }
  }

  findOne(key: UserKeyDto) {
    return this.userModel.get(key);
  }

  findAll() {
    return this.userModel.scan().exec();
  }

  async delete(key: UserKeyDto) {
    try {
      const user = await this.findOne(key);
      if (!user) throw new Error(`User '${key.uid}' does not exist`);
      await this.userModel.delete(user);
      return `Successfully deleted ${user.uid}`;
    } catch (e) {
      return String(e);
    }
  }
}
