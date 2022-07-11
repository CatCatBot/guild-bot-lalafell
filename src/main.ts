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
      console.log(data);
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
}
