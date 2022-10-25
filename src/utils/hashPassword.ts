import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class EncryptPassword {
  async hashPassword(password: string): Promise<string | undefined> {
    try {
      const passwordHashed = await bcrypt.hash(password, 9);
      return passwordHashed;
    } catch (error) {
      console.log(error);
    }
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
