import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService
    ) { }
    
    async validatePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    async generateToken(userId: string): Promise<string> {
        return this.jwtService.sign({ sub: userId });
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user || !(await this.validatePassword(password, user.password))) {
          throw new UnauthorizedException('Invalid credentials');
        }
        const token = await this.generateToken(user.id);
        return { token, user };
      }




}
