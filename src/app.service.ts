import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  sendMsg(msg: string): string {
    return msg;
  }
}
