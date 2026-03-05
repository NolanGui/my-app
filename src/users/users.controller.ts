import { Body, Controller, Param, Post, Get, Query, NotFoundException, UseInterceptors, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UsersService } from './users.service';
import { SerializeInterceptor } from './interceptor/users.interceptor';
import { User } from './entities/user.entity';
import { CurrentUserInterceptor } from './interceptor/current.users.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorator/current-user.decorator';
 
@Controller('auth')
@UseInterceptors(CurrentUserInterceptor)
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
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.usersService.signin(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post('/signout')
    async signout(@Session() session: any) {
        session.userId = null
    }

    @Post('/whoAmI')
    @UseGuards(AuthGuard)
    async whoAmI(@CurrentUser() user: User) {
        return user
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
