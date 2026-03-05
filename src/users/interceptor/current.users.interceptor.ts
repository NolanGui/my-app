import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Observable } from 'rxjs'
import { UsersService } from '../users.service'

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private moduleRef: ModuleRef) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        const { userId } = request.session || {}
        if (userId) {
            const usersService = this.moduleRef.get(UsersService, { strict: false })
            const user = await usersService.findOne(userId)
            console.log('user in interceptor: ', user)
            request.currentUser = user
        }
        return next.handle()
    }
}