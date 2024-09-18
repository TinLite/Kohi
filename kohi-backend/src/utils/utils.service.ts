import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UtilsService {
  private readonly saltRounds = 10;
  async hashPassword(plainPassword: string) {
    try {
      return await bcrypt.hash(plainPassword, this.saltRounds);
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
  //fortmatLikeCount
   async formatLikeCount(count: number) {
    if (count < 1000) {
      return count.toString();
    } else if (count < 1000000) {
      return (count / 1000).toFixed(1) + 'K';
    } else if (count < 1000000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else {
      return (count / 1000000000).toFixed(1) + 'B';
    }
  }
}
