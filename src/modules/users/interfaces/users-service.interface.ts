import { IUserResponse } from './user.interface';

export interface IUsersService {
  findByEmail(email: string): Promise<any>;
  findById(id: string): Promise<IUserResponse | null>;
  createUser(email: string, password: string, name?: string): Promise<any>;
  updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
}
