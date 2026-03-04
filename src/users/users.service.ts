import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) {

    }

    create(email: string, password: string) {
        const user = this.repo.create({email, password})
        return this.repo.save(user)
    }

    async findOne(id: number) {
        const user = await this.repo.findOneBy({id})
        return user 
    }

    async find(email: string) {
        const users = await this.repo.findBy({email})
        return users
    }
}
