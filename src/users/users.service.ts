import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { randomBytes, scrypt as _scrypt, scrypt } from "crypto";
import { promisify } from "util";

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) {

    }

    async signup(email: string, password: string) {

        //Se if email is in use
        const user = await this.findByEmail(email);
        if (user.length !=0) {
            throw new BadRequestException('Email already in use');
        }
        
        //Hash the password by generating a salt and then hashing the password

        // 1. Generate the salt
        const salt = randomBytes(8).toString('hex');

        // 2. Hash the password using the salt
        const hash = await this.hashPassword(password, salt);

        // 3. Join the hash result and the salt
        const result = salt + '.' + hash;

        //Create a new user
        return this.create(email, result);
    }

    private async hashPassword(password: string, salt: string) {
        const hash = (await promisify(_scrypt)(password, salt, 32)) as Buffer;
        return hash.toString('hex');
    }

    async signin(email: string, password: string) {
        const users = await this.findByEmail(email);
        if (users.length == 0) {
            throw new BadRequestException('User not found');
        }

        const user = users[0]

        const [salt, storedHash] = user.password.split('.')

        const hash = (await promisify(_scrypt)(password, salt, 32)) as Buffer

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Email or password do not match')
        }

        return user
    }

    create(email: string, password: string) {
        const user = this.repo.create({email, password})
        return this.repo.save(user)
    }

    async findOne(id: number) {
        if (!id) {
            return null
        }
        const user = await this.repo.findOneBy({id})
        return user 
    }

    async findByEmail(email: string) {
        const users = await this.repo.findBy({email})
        return users
    }
}
