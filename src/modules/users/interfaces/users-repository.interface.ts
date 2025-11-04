import { User } from '../entities/user.entity';

export interface IUsersRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(email: string, hashedPassword: string, name?: string): Promise<User>;
  updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
}
