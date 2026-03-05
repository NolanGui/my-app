import { Body, Controller, Param, Post, Get, Query, NotFoundException, UseInterceptors, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from './interceptor/users.interceptor';
import { User } from './entities/user.entity';

@Controller('auth')
@UseInterceptors(SerializeInterceptor)
export class UsersController {

    constructor(private usersService: UsersService) {

    }

    @Post('/signup')
    createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = this.usersService.signup(body.email, body.password)
        return user
    }

    @Post('/signin')
    signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user =this.usersService.signin(body.email, body.password)
        return user
    }

    @Post('/signout')
    async signout(@Session() session: any) {
        session.userId = null
    }

    @Post('/whoAmI')
    async whoAmI(@Session() session: any) {
        return await this.usersService.findOne(session.userId)
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
        const user = await this.usersService.findByEmail(email)
        if (!user) {
            throw new NotFoundException('Email user not found')
        }
        return user
    }
}
