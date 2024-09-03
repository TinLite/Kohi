import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UtilsService {
    private readonly saltRounds = 10;
    async hashPassword(plainPassword: string) {
        try {
            return await  bcrypt.hash(plainPassword,this.saltRounds);
        } catch (error) {
            console.log(error);
        }
    }
    //so sanh mk
    async comparePassword(plainPassword: string, hashedPassword: string) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.log(error);
        }
    }
}
