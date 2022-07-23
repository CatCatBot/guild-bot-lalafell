import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AvailableIntentsEventsEnum,
  createOpenAPI,
  createWebsocket,
} from 'qq-guild-bot';
import { lalafellConfig, baseConfig } from './bot/config/lalafell.config';
import { loadPlugins } from './bot/core/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  initBot();
}
bootstrap();
function initBot() {
  const client = createOpenAPI(lalafellConfig);
  const ws = createWebsocket(lalafellConfig);
  ws.on(
    AvailableIntentsEventsEnum.GUILD_MESSAGES,
    async (data: { eventType: string; msg: any }) => {
      try {
        loadPlugins(client, data);
      } catch (error) {
        console.error(error);
      }
      const content = data.msg?.content;
      if (content?.includes(`<@!${baseConfig.robotId}>`)) {
        if (content?.includes('/hi')) {
          client.messageApi.postMessage(data.msg.channel_id, {
            content: '您好，莉莉菈为您服务！',
            msg_id: data.msg.id,
          });
        }
      }
    },
  );
  ws.on(
    AvailableIntentsEventsEnum.GUILD_MESSAGE_REACTIONS,
    async (data: { eventType: string; msg: any }) => {
      try {
        loadPlugins(client, data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    },
  );
  ws.on(AvailableIntentsEventsEnum.DIRECT_MESSAGE, async (data: any) => {
    try {
      // loadPlugins(client, data);
      // {
      //   eventType: 'DIRECT_MESSAGE_CREATE',
      //   eventId: 'DIRECT_MESSAGE_CREATE:08c8d2bfe2da94ae8d7e10c589e68fb5e9c724380448e68ad89606',
      //   msg: {
      //     author: {
      //       avatar: 'https://qqchannel-profile-1251316161.file.myqcloud.com/165718102137bd740b742cd4ea?t=1657181021',
      //       id: '11031792250715367783',
      //       username: '喵喵酱'
      //     },
      //     channel_id: '20582081658193093',
      //     content: '你好',
      //     direct_message: true,
      //     guild_id: '9086778219873429832',
      //     id: '08c8d2bfe2da94ae8d7e10c589e68fb5e9c724380448e68ad89606',
      //     member: { joined_at: '2022-07-19T09:11:33+08:00' },
      //     seq: 4,
      //     seq_in_channel: '4',
      //     src_guild_id: '15333404033049901171',
      //     timestamp: '2022-07-19T09:14:14+08:00'
      //   }
      // }
      if(data.eventType === 'DIRECT_MESSAGE_DELETE') {
        return;
      }
      console.log(data);
      // const res:any = await createDirectMessage(data.msg.author.id, data.msg.guild_id);
    //   await fetch(`https://api.sgroup.qq.com/dms/${data.msg.guild_id}/messages`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bot ${secret.appID}.${secret.token}`,
    //     },
    //     body: JSON.stringify({
    //       content: '您好，莉莉菈为您服务！',
    //       msg_id: data.msg.id,
    //     }),
    // }  ).then(res => res);
    loadPlugins(client, data);
  } catch (error) {
    console.error(error);
  }
});
}
