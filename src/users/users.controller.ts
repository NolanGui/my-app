import { Body, Controller, Param, Post, Get, Query, NotFoundException, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from './interceptor/users.interceptor';

@Controller('auth')
@UseInterceptors(SerializeInterceptor)
export class UsersController {

    constructor(private usersService: UsersService) {

    }

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        this.usersService.create(body.email, body.password)
    }

    @Get('/:id')
    @UseInterceptors(SerializeInterceptor)
    async findById(@Param('id') id: number) {
        const user = await this.usersService.findOne(id)
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    @Get()
    async findUserByEmail(@Query('email') email: string) {
        const user = await this.usersService.find(email)
        if (!user) {
            throw new NotFoundException('Email user not found')
        }
        return user
    }
}
