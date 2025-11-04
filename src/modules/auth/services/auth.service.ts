import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import {
  IAuthService,
  IAuthResponse,
  ITokens,
} from '../interfaces/auth-service.interface';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<IAuthResponse> {
    const user = await this.usersService.createUser(
      registerDto.email,
      registerDto.password,
      registerDto.name,
    );

    const tokens = await this.generateTokens(user.id, user.email);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<IAuthResponse> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<ITokens> {
    // Decode refresh token to get userId if not provided
    let userIdToUse = userId;
    if (!userIdToUse) {
      try {
        const decoded = this.jwtService.verify(refreshToken, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
        userIdToUse = decoded.sub;
      } catch (error) {
        throw new ForbiddenException('Invalid refresh token');
      }
    }

    // Get user with refresh token from database (not sanitized)
    const userWithToken = await this.usersService.findByEmail(
      (await this.usersService.findById(userIdToUse))?.email,
    );
    
    if (!userWithToken || !userWithToken.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      userWithToken.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.generateTokens(userWithToken.id, userWithToken.email);
    await this.usersService.updateRefreshToken(userWithToken.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  private async generateTokens(userId: string, email: string): Promise<ITokens> {
    const payload: IJwtPayload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
