import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AvailableIntentsEventsEnum,
  createOpenAPI,
  createWebsocket,
  IMessage,
} from 'qq-guild-bot';
import { lalafellConfig, baseConfig } from './bot/config/lalafell.config';

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
    (data: { msg: IMessage }) => {
      console.log(data);
      const content = data.msg?.content;
      if (content?.includes('ping')) {
        client.messageApi.postMessage(data.msg.channel_id, {
          content: 'pong',
        });
      }
      if (content?.includes(`<@!${baseConfig.robotId}>`)) {
        if (content?.includes('/hi')) {
          client.messageApi.postMessage(data.msg.channel_id, {
            content: 'Hello!',
          });
        }
      }
      if (content?.includes(`<@!${baseConfig.robotId}>`)) {
        if (content?.includes('/role')) {
          client.messageApi
            .postMessage(data.msg.channel_id, {
              content:
                '选择你的角色吧!\n 选择 <emoji:307> 领取 猫猫 \n 选择 <emoji:306> 领取 拉拉肥',
            })
            .then((res) => {
              console.info(res.data);
            })
            .catch(console.error);
        }
      }
    },
  );
  ws.on(
    AvailableIntentsEventsEnum.GUILD_MESSAGE_REACTIONS,
    async (data: { eventType: string; msg }) => {
      if (data.eventType === 'MESSAGE_REACTION_REMOVE') {
        return;
      }
      console.log(data);
      const messageID = data.msg.target.id;
      const channelID = data.msg.channel_id;
      const emoji = data.msg.emoji.id;
      const guildID = data.msg.guild_id;
      const userID = data.msg.user_id;
      const { data: data1 } = await client.guildApi.guildMember(
        guildID,
        userID,
      );
      const nick = data1.nick;
      client.roleApi.roles(guildID).then((res) => {
        const roles = res.data.roles;
        client.messageApi
          .message(channelID, messageID)
          .then(async (res) => {
            console.info(res.data);
            if (res.data.message.content.includes('选择你的角色吧')) {
              if (emoji === '307') {
                const { data } = await client.guildApi.guildMember(
                  guildID,
                  userID,
                );
                if (
                  data.roles.includes(
                    roles.find((role) => role.name === '猫猫').id.toString(),
                  )
                ) {
                  client.messageApi
                    .postMessage(channelID, {
                      content: `${nick} 你已经是 猫猫 了<emoji:271>`,
                    })
                    .then((res) => {
                      console.info(res.data);
                    })
                    .catch(console.error);
                } else {
                  client.messageApi
                    .postMessage(channelID, {
                      content: `${nick} 你选择了 猫猫<emoji:179>`,
                    })
                    .then((res) => {
                      client.memberApi.memberAddRole(
                        guildID,
                        roles.find((role) => role.name === '猫猫').id,
                        userID,
                        channelID,
                      );
                    });
                }
              }
              if (emoji === '306') {
                const { data } = await client.guildApi.guildMember(
                  guildID,
                  userID,
                );
                if (
                  data.roles.includes(
                    roles.find((role) => role.name === '拉拉肥').id.toString(),
                  )
                ) {
                  client.messageApi
                    .postMessage(channelID, {
                      content: `${nick} 你已经是 拉拉肥 了<emoji:271>`,
                    })
                    .then((res) => {
                      console.info(res.data);
                    })
                    .catch(console.error);
                } else {
                  client.messageApi
                    .postMessage(channelID, {
                      content: `${nick} 你选择了 拉拉肥<emoji:179>`,
                    })
                    .then((res) => {
                      client.memberApi.memberAddRole(
                        guildID,
                        roles.find((role) => role.name === '拉拉肥').id,
                        userID,
                        channelID,
                      );
                    });
                }
              }
            }
          })
          .catch(console.error);
      });
    },
  );
}
