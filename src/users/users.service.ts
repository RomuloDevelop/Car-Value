import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  createUser(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attr: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) return new NotFoundException('User not found');

    return this.repo.save(Object.assign(user, attr));
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) return new NotFoundException('User not found');

    return this.repo.remove(user);
  }
}
