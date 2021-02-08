import { User, UserDocument } from './schemas/user.schema';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUsersService } from './interfaces/IUserService';

import { v4 as uuid } from 'uuid';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class UsersService implements IUsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll() {
    this.connection.db.collection('ads').aggregate()
    return this.userModel.find();
  }

  async findOne(id: string) {
    const user = this.userModel.findById(id);

    if (!user) {
      this.logger.warn(`User with id ${id} doen't exist`);
      this.logger.error(`User with id ${id} doen't exist`);
      this.logger.debug(`User with id ${id} doen't exist`);
      throw new NotFoundException(`User with id ${id} doen't exist`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    user.username = updateUserDto.username ?? user.username;
    user.email = updateUserDto.email ?? user.email;

    return user.save();
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    user.remove();
    return id;
  }
}
