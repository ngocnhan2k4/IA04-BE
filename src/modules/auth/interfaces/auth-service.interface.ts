import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  tokens: ITokens;
}

export interface IAuthService {
  register(registerDto: RegisterDto): Promise<IAuthResponse>;
  login(loginDto: LoginDto): Promise<IAuthResponse>;
  refreshTokens(userId: string, refreshToken: string): Promise<ITokens>;
  logout(userId: string): Promise<void>;
}
