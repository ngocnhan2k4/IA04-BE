import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../repositories/users.repository';
import { IUsersService } from '../interfaces/users-service.interface';
import { IUserResponse } from '../interfaces/user.interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string): Promise<IUserResponse | null> {
    const user = await this.usersRepository.findById(id);
    if (!user) return null;

    return this.sanitizeUser(user);
  }

  async createUser(email: string, password: string, name?: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.create(email, hashedPassword, name);
    return this.sanitizeUser(user);
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<void> {
    const hashedRefreshToken = refreshToken
      ? await bcrypt.hash(refreshToken, 10)
      : null;
    await this.usersRepository.updateRefreshToken(userId, hashedRefreshToken);
  }

  private sanitizeUser(user: any): IUserResponse {
    const { password, refreshToken, ...result } = user;
    return result;
  }
}
