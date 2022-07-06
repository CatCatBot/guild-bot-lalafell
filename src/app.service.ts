import { Injectable } from '@nestjs/common';
import { createOpenAPI, createWebsocket } from 'qq-guild-bot';
import { lalafellConfig } from './bot/config/lalafell.config';

const client = createOpenAPI(lalafellConfig);
const websocket = createWebsocket(lalafellConfig);
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  sendMsg(msg: string): string {
    client.meApi
      .meGuilds()
      .then((res) => {
        console.log(res.data);
        client.channelApi.channels(res.data[0].id).then((res) => {
          res.data.forEach((channel) => {
            if (channel.name === '测试聊天') {
              client.messageApi
                .postMessage(channel.id, {
                  content: msg,
                })
                .then((res) => {
                  console.log(res.data);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
    return msg;
  }
}
