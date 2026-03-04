import { Expose, Exclude } from "class-transformer"

export class SerializeUserDto {
    @Expose()
    id: number     
    
    @Expose()
    email: string 

    @Expose()
    password: string
}   