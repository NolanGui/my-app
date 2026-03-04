import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Next } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";
import { CreateUserDto } from "../dtos/createUser.dto";
import { SerializeUserDto } from "../dtos/interceptorUser.dto";

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        console.log('Avant le handler...')
    
        return next.handle().pipe(
            map((data: any) => {
                    console.log("Après le handler")
                    return plainToInstance(SerializeUserDto, data);
                }
            )
        )

    }
    

}