import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dtos/create-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup({ email, password }: CreateUserDto) {
    // See if email already exists
    const users = await this.userService.find(email);
    if (users.length) return new BadRequestException('User already exists');

    // Hash password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    // Create user
    return this.userService.createUser(email, result);
  }

  async signin({ email, password }: CreateUserDto) {
    const [user] = await this.userService.find(email);

    if (!user) return new NotFoundException('Invalid credentials');

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      return new NotFoundException('Invalid credentials');
    }

    return user;
  }
}
