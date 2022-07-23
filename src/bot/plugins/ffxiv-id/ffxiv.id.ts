import nodeHtmlToImage from 'node-html-to-image';
import { LalafellDataSource } from 'src/bot/config/dataSource';
import { baseConfig } from 'src/bot/config/lalafell.config';
import { GuildLiLiLaUser } from 'src/bot/entities/guild.lilila.user';
import {
  postDirectMessage,
  posteDirectImage,
  postImage,
} from 'src/bot/ext/post';

const guildLiLiLaUserRepository =
  LalafellDataSource.getRepository(GuildLiLiLaUser);
const ffxivId = async (
  client: any,
  data: { eventType: string; msg: any },
  spread: boolean,
) => {
  if (data.eventType === 'MESSAGE_CREATE' && spread) {
    console.log(data);
    const channelID = data.msg.channel_id;
    const content = data.msg?.content;
    const userID = data.msg?.author.id;
    if (content?.includes(`<@!${baseConfig.robotId}>`)) {
      if (content?.includes('名片 帮助')) {
        spread = false; // msg will not be spreaded to other plugins
        const help_text =
          `📘 @bot 名片 帮助 -> 查看名片帮助\n` +
          `🌱 @bot card @菈米米 -> 获取自己(或菈米米)的名片\n` +
          `📚 私信bot或@bot 例如 ‘添加名片 菈米米 陆行鸟.幻影群岛 ’ 添加菈米米的名片（可以在消息中添加图片用作[头像]）\n` +
          '📝 *尚未实装* 私信bot或@bot 例如 ‘修改名片 最大等级 90’ 补全或修改菈米米的名片\n' +
          '   ┌  [最大等级]可被替换：[所在服务器],[所在部队],[擅长职业],[加入时间],\n' +
          '   |  [游玩时间],[简介],[头像],[昵称]。\n' +
          '   |  [头像]对应一张图片即可，私信暂时不能文字、图片一起发送,\n' +
          '   |  可以在频道中@bot补全或修改。\n' +
          '   └  [所在服务器]示例:‘修改名片 所在服务器 猫小胖.柔风海湾’。';
        client.messageApi.postMessage(channelID, {
          content: help_text,
          msg_id: data.msg.id,
        });
      }
      if (content?.includes('card')) {
        spread = false; // msg will not be spreaded to other plugins
        const cc = content
          .replace(`<@!${baseConfig.robotId}>`, '')
          .replace('card', '')
          .trim();
        let user: GuildLiLiLaUser;
        if (cc.length === 0) {
          // get own card
          user = await guildLiLiLaUserRepository.findOne({
            where: {
              gid: userID,
            },
          });
        } else {
          // get other card
          const gid = cc.replace('<@!', '').replace('>', '');
          user = await guildLiLiLaUserRepository.findOne({
            where: {
              gid: gid,
            },
          });
        }
        // generate card from html
        if (user) {
          console.log(user);
          nodeHtmlToImage({
            puppeteerArgs: { args: ['--no-sandbox'] },
            output: './src/bot/plugins/ffxiv-id/card.png',
            html: ` 
            <html>

            <head>
              <style>
                body {
                  width: 300px;
                  height: 95px;
                }
            
                .l-box.u-with-margin {
                  margin-bottom: 10px;
                }
            
                .l-box.u-transparent {
                  background: rgba(36, 37, 41);
                }
            
                .b-user-info {
                  display: flex;
                }
            
                .l-box {
                  background: #558B2F;
                  padding: 20px;
                border-radius:5px;
                }
            
                * {
                  box-sizing: border-box;
                }
            
                .b-user-info-avatar {
                  height: 64px;
                  margin-right: 20px;
                  width: 64px;
                }
            
                .u-inset {
                  border-radius: 8px;
                  overflow: hidden;
                }
            
                img {
                  display: block;
                }
            
                img {
                  border-style: none;
                }
            
                .b-user-info-text {
                  color: #fff;
                  display: flex;
                  flex-direction: column;
                  font-family: 'Roboto', sans-serif;
                  font-size: 14px;
                  font-weight: 600;
                  justify-content: center;
                  line-height: 30px;
                  margin: 0;
                  padding-left: 20px;
                  position: relative;
                }
            
                .b-user-info-text:before {
                  background-color: #e56a00;
                  bottom: 0;
                  content: "";
                  height: 100%;
                  left: 0;
                  position: absolute;
                  top: 0;
                  width: 2px;
                }
            
                h2 {
                  display: block;
                  font-size: 1.5em;
                  margin-block-start: 0.83em;
                  margin-block-end: 0.83em;
                  margin-inline-start: 0px;
                  margin-inline-end: 0px;
                  font-weight: bold;
                }
            
                .b-user-info-text-name {
                  padding-bottom: 10px;
                  color: #ffffff;
                  display: block;
                  font-size: 24px;
                  font-weight: 400;
                  line-height: 32px;
                  max-width: 160px;
                  word-break: break-word;
                }
            
                .b-user-info-text-server {
                  color: #e56a00;
                  line-height: 14px;
                  align-self: center;
                }
            
                * {
                  box-sizing: border-box;
                }
              </style>
                    </head>
                    <body>
                      <div class="l-box u-transparent u-with-margin b-user-info">
                        <img src="https://${user.avatar
              }" alt="lilila" class="b-user-info-avatar u-inset"> 
                        <h2 class="b-user-info-text">
                        
                        <span class="b-user-info-text-name ">${user.nickname
              }</span> 
                        <span class="b-user-info-text-server">${user.server.replace(
                '.',
                ' ',
              )}</span>
                        </h2>
                      </div>
                    </body>
                  </html>`,
          }).then(() => {
            console.log('The image was created successfully!');
            postImage(data.msg, './src/bot/plugins/ffxiv-id/card.png');
          });
        } else {
          client.messageApi.postMessage(channelID, {
            content: '没有找到该用户的名片',
            msg_id: data.msg.id,
          });
        }
      }
      let usage = content.replace(`<@!${baseConfig.robotId}>`, '').trim();
      let cardHanderResult = await cardUsageHandler(usage, userID, spread, data);
      let reply = cardHanderResult.reply;
      spread = cardHanderResult.spread;
      if (reply) {
        client.messageApi.postMessage(channelID, {
          content: reply,
          msg_id: data.msg.id,
        });
      }
      
    }
  }
  if (data.eventType === 'DIRECT_MESSAGE_CREATE' && spread) {
    console.log(data);
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
    const userID = data.msg?.author?.id;
    if (content?.includes('名片 帮助')) {
      spread = false; // msg will not be spreaded to other plugins
      const help_text =
        `📘 @bot 名片 帮助 -> 查看名片帮助\n` +
        `🌱 @bot card @菈米米 -> 获取自己(或菈米米)的名片\n` +
        `📚 私信bot或@bot 例如 ‘添加名片 菈米米 陆行鸟.幻影群岛 ’ 添加菈米米的名片（可以在消息中添加图片用作[头像]）\n` +
        '📝 *尚未实装* 私信bot或@bot 例如 ‘修改名片 最大等级 90’ 补全或修改菈米米的名片\n' +
        '   ┌  [最大等级]可被替换：[所在服务器],[所在部队],[擅长职业],[加入时间],\n' +
        '   |  [游玩时间],[简介],[头像],[昵称]。\n' +
        '   |  [头像]对应一张图片即可，私信暂时不能文字、图片一起发送,\n' +
        '   |  可以在频道中@bot补全或修改。\n' +
        '   └  [所在服务器]示例:‘修改名片 所在服务器 猫小胖.柔风海湾’。';
      postDirectMessage(guildID,{
        content: help_text,
        msg_id: data.msg.id,
      })
    }
    if (content?.includes('card')) {
      spread = false; // msg will not be spreaded to other plugins
      const cc = content
        .replace(`<@!${baseConfig.robotId}>`, '')
        .replace('card', '')
        .trim();
      let user: GuildLiLiLaUser;
      if (cc.length === 0) {
        // get own card
        user = await guildLiLiLaUserRepository.findOne({
          where: {
            gid: userID,
          },
        });
      } else {
        // get other card
        const gid = cc.replace('<@!', '').replace('>', '');
        user = await guildLiLiLaUserRepository.findOne({
          where: {
            gid: gid,
          },
        });
      }
      // generate card from html
      if (user) {
        console.log(user);
        nodeHtmlToImage({
          puppeteerArgs: { args: ['--no-sandbox'] },
          output: './src/bot/plugins/ffxiv-id/card.png',
          html: ` 
          <html>

          <head>
            <style>
              body {
                width: 300px;
                height: 95px;
              }
          
              .l-box.u-with-margin {
                margin-bottom: 10px;
              }
          
              .l-box.u-transparent {
                background: rgba(36, 37, 41);
              }
          
              .b-user-info {
                display: flex;
              }
          
              .l-box {
                background: #558B2F;
                padding: 20px;
              border-radius:5px;
              }
          
              * {
                box-sizing: border-box;
              }
          
              .b-user-info-avatar {
                height: 64px;
                margin-right: 20px;
                width: 64px;
              }
          
              .u-inset {
                border-radius: 8px;
                overflow: hidden;
              }
          
              img {
                display: block;
              }
          
              img {
                border-style: none;
              }
          
              .b-user-info-text {
                color: #fff;
                display: flex;
                flex-direction: column;
                font-family: 'Roboto', sans-serif;
                font-size: 14px;
                font-weight: 600;
                justify-content: center;
                line-height: 30px;
                margin: 0;
                padding-left: 20px;
                position: relative;
              }
          
              .b-user-info-text:before {
                background-color: #e56a00;
                bottom: 0;
                content: "";
                height: 100%;
                left: 0;
                position: absolute;
                top: 0;
                width: 2px;
              }
          
              h2 {
                display: block;
                font-size: 1.5em;
                margin-block-start: 0.83em;
                margin-block-end: 0.83em;
                margin-inline-start: 0px;
                margin-inline-end: 0px;
                font-weight: bold;
              }
          
              .b-user-info-text-name {
                padding-bottom: 10px;
                color: #ffffff;
                display: block;
                font-size: 24px;
                font-weight: 400;
                line-height: 32px;
                max-width: 160px;
                word-break: break-word;
              }
          
              .b-user-info-text-server {
                color: #e56a00;
                line-height: 14px;
                align-self: center;
              }
          
              * {
                box-sizing: border-box;
              }
            </style>
                  </head>
                  <body>
                    <div class="l-box u-transparent u-with-margin b-user-info">
                      <img src="https://${user.avatar
            }" alt="lilila" class="b-user-info-avatar u-inset"> 
                      <h2 class="b-user-info-text">
                      
                      <span class="b-user-info-text-name ">${user.nickname
            }</span> 
                      <span class="b-user-info-text-server">${user.server.replace(
              '.',
              ' ',
            )}</span>
                      </h2>
                    </div>
                  </body>
                </html>`,
        }).then(() => {
          console.log('The image was created successfully!');
          posteDirectImage(data.msg, './src/bot/plugins/ffxiv-id/card.png');
        });
      } else {
        postDirectMessage(guildID, {
          content: '没有找到该用户的名片',
          msg_id: data.msg.id,
        });
      }

    }
    let usage:string = content?.replace(`<@!${baseConfig.robotId}>`, '').trim();
      let cardHanderResult = await cardUsageHandler(usage, userID, spread, data);
      let reply = cardHanderResult.reply;
      spread = cardHanderResult.spread;
      if (reply) {
        postDirectMessage(guildID, {
          content: reply,
          msg_id: data.msg.id,
        });
  }
  return spread;
};


}
async function cardUsageHandler(usage: any, userID: any,spread:boolean, data:  {
  eventType: string;
  msg: any;
}) {
  let reply = '';
  if(!usage){
    return {
      reply: '',
      spread: spread,
    }
  }
  if (usage.startsWith(' ')) {
    usage = usage.replace(' ', '');
  }
  if (usage?.includes('添加名片')) {
    spread = false; // msg will not be spreaded to other plugins
    const content_arr = usage.split(' ');
    const nickname = content_arr[1];
    const server = content_arr[2];
    const user = new GuildLiLiLaUser();
    user.gid = userID;
    user.server = server;
    user.nickname = nickname;
    user.server = server;
    if (data.msg.attachments.length > 0) {
      const image_url = data.msg.attachments[0].url;
      user.avatar = image_url;
    }
    if (await guildLiLiLaUserRepository.findOne({
      where: {
        gid: userID,
      },
    })) {
      await guildLiLiLaUserRepository.update(
        {
          gid: userID,
        },
        user,
      );
    } else {
      await guildLiLiLaUserRepository.save(user);
    }
    reply = `📝添加名片成功。\n🌱 @bot card @菈米米 -> 获取自己(或菈米米)的名片`;
  }

  if (usage?.includes('修改名片')) {
    spread = false; // msg will not be spreaded to other plugins
    const user = await guildLiLiLaUserRepository.findOne({
      where: {
        gid: userID,
      },
    });
    if (user) {
      if (usage?.includes('所在服务器')) {
        const server = usage.split(' ')[1];
        if (server) {
          user.server = server;
          await guildLiLiLaUserRepository.update(
            {
              gid: userID,
            },
            user,
          )
          reply = `修改成功 所在服务器 ${server}`;
        } else {
          reply = `修改失败 所在服务器 不能为空`;
        }
      }
      if (usage?.includes('昵称')) {
        const nickname = usage.split(' ')[1];
        if (nickname) {
          user.nickname = nickname;
          await guildLiLiLaUserRepository.update(
            {
              gid: userID,
            },
            user,
          )
          reply = `修改成功 昵称 ${nickname}`;
        } else {
          reply = `修改失败 昵称 不能为空`;
        }
      }
      if (usage?.includes('头像')) {
        const image_url = usage.split(' ')[2];
        if (image_url) {
          user.avatar = image_url;
          await guildLiLiLaUserRepository.update(
            {
              gid: userID,
            },
            user,
          )
          reply = `修改头像成功`;
        } else {
          reply = `修改头像失败`;
        }
      }
      if (usage?.includes('删除名片')) {
        await guildLiLiLaUserRepository.delete(user);
        reply = `删除名片成功`;
      }
      if (usage?.includes('最大等级')) {
        const max_level = usage.split(' ')[1];
        if (max_level) {
          user.max_level = Number.parseInt(max_level);
          await guildLiLiLaUserRepository.update(
            {
              gid: userID,
            },
            user,
          )
          reply = `修改成功 最大等级 ${max_level}`;
        } else {
          reply = `修改失败 最大等级 不能为空`;
        }
      }
      if (usage?.includes('所在部队')) {
        const guild = usage.split(' ')[1];
        if (guild) {
          user.guild = guild;
          await guildLiLiLaUserRepository.update(
            {
              gid: userID,
            },
            user,
          )
          reply = `修改成功 所在部队 ${guild}`;
        } else {
          reply = `修改失败 所在部队 不能为空`;
        }
      }
    } else {
      reply = `没有找到该用户的名片`;
    }
  }
  return {reply,spread};
};
export default ffxivId;