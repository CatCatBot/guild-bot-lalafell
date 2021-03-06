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
    const channelID = data.msg.channel_id;
    const content = data.msg?.content;
    const userID = data.msg?.author.id;
    if (content?.includes(`<@!${baseConfig.robotId}>`)) {
      if (content?.includes('åç å¸®å©')) {
        console.log('loading plugin: ffxiv-id ...');
        spread = false; // msg will not be spreaded to other plugins
        const help_text =
          `ð @bot åç å¸®å© -> æ¥çåçå¸®å©\n` +
          `ð± @bot card @èç±³ç±³ -> è·åèªå·±(æèç±³ç±³)çåç\n` +
          `ð ç§ä¿¡botæ@bot ä¾å¦ âæ·»å åç èç±³ç±³ éè¡é¸.å¹»å½±ç¾¤å² â æ·»å èç±³ç±³çåçï¼å¯ä»¥å¨æ¶æ¯ä¸­æ·»å å¾çç¨ä½[å¤´å]ï¼\n` +
          'ð *å°æªå®è£* ç§ä¿¡botæ@bot ä¾å¦ âä¿®æ¹åç æå¤§ç­çº§ 90â è¡¥å¨æä¿®æ¹èç±³ç±³çåç\n' +
          '   â  [æå¤§ç­çº§]å¯è¢«æ¿æ¢ï¼[æå¨æå¡å¨],[æå¨é¨é],[æé¿èä¸],[å å¥æ¶é´],\n' +
          '   |  [æ¸¸ç©æ¶é´],[ç®ä»],[å¤´å],[æµç§°]ã\n' +
          '   |  [å¤´å]å¯¹åºä¸å¼ å¾çå³å¯ï¼ç§ä¿¡ææ¶ä¸è½æå­ãå¾çä¸èµ·åé,\n' +
          '   |  å¯ä»¥å¨é¢éä¸­@botè¡¥å¨æä¿®æ¹ã\n' +
          '   â  [æå¨æå¡å¨]ç¤ºä¾:âä¿®æ¹åç æå¨æå¡å¨ ç«å°è.æé£æµ·æ¹¾âã';
        client.messageApi.postMessage(channelID, {
          content: help_text,
          msg_id: data.msg.id,
        });
      }
      if (content?.includes('card')) {
        console.log('loading plugin: ffxiv-id ...');
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
            content: 'æ²¡ææ¾å°è¯¥ç¨æ·çåç',
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
    if (content?.includes('åç å¸®å©')) {
      console.log('loading plugin: ffxiv-id ...');
      spread = false; // msg will not be spreaded to other plugins
      const help_text =
        `ð @bot åç å¸®å© -> æ¥çåçå¸®å©\n` +
        `ð± @bot card @èç±³ç±³ -> è·åèªå·±(æèç±³ç±³)çåç\n` +
        `ð ç§ä¿¡botæ@bot ä¾å¦ âæ·»å åç èç±³ç±³ éè¡é¸.å¹»å½±ç¾¤å² â æ·»å èç±³ç±³çåçï¼å¯ä»¥å¨æ¶æ¯ä¸­æ·»å å¾çç¨ä½[å¤´å]ï¼\n` +
        'ð *å°æªå®è£* ç§ä¿¡botæ@bot ä¾å¦ âä¿®æ¹åç æå¤§ç­çº§ 90â è¡¥å¨æä¿®æ¹èç±³ç±³çåç\n' +
        '   â  [æå¤§ç­çº§]å¯è¢«æ¿æ¢ï¼[æå¨æå¡å¨],[æå¨é¨é],[æé¿èä¸],[å å¥æ¶é´],\n' +
        '   |  [æ¸¸ç©æ¶é´],[ç®ä»],[å¤´å],[æµç§°]ã\n' +
        '   |  [å¤´å]å¯¹åºä¸å¼ å¾çå³å¯ï¼ç§ä¿¡ææ¶ä¸è½æå­ãå¾çä¸èµ·åé,\n' +
        '   |  å¯ä»¥å¨é¢éä¸­@botè¡¥å¨æä¿®æ¹ã\n' +
        '   â  [æå¨æå¡å¨]ç¤ºä¾:âä¿®æ¹åç æå¨æå¡å¨ ç«å°è.æé£æµ·æ¹¾âã';
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
          content: 'æ²¡ææ¾å°è¯¥ç¨æ·çåç',
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
return spread;
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
  if (usage?.includes('æ·»å åç')) {
    console.log('loading plugin ffxiv-id');
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
    reply = `ðæ·»å åçæåã\nð± @bot card @èç±³ç±³ -> è·åèªå·±(æèç±³ç±³)çåç`;
  }

  if (usage?.includes('ä¿®æ¹åç')) {
    console.log('loading plugin ffxiv-id');
    spread = false; // msg will not be spreaded to other plugins
    const user = await guildLiLiLaUserRepository.findOne({
      where: {
        gid: userID,
      },
    });
    if (user) {
      if (usage?.includes('æå¨æå¡å¨')) {
        const server = usage.split(' ')[1];
        if (server) {
          user.server = server;
          await guildLiLiLaUserRepository.update(
            {
              gid: userID,
            },
            user,
          )
          reply = `ä¿®æ¹æå æå¨æå¡å¨ ${server}`;
        } else {
          reply = `ä¿®æ¹å¤±è´¥ æå¨æå¡å¨ ä¸è½ä¸ºç©º`;
        }
      }
      if (usage?.includes('æµç§°')) {
        const nickname = usage.split(' ')[1];
        if (nickname) {
          user.nickname = nickname;
          await guildLiLiLaUserRepository.update(
            {
              gid: userID,
            },
            user,
          )
          reply = `ä¿®æ¹æå æµç§° ${nickname}`;
        } else {
          reply = `ä¿®æ¹å¤±è´¥ æµç§° ä¸è½ä¸ºç©º`;
        }
      }
      if (usage?.includes('å¤´å')) {
        const image_url = usage.split(' ')[2];
        if (image_url) {
          user.avatar = image_url;
          await guildLiLiLaUserRepository.update(
            {
              gid: userID,
            },
            user,
          )
          reply = `ä¿®æ¹å¤´åæå`;
        } else {
          reply = `ä¿®æ¹å¤´åå¤±è´¥`;
        }
      }
      if (usage?.includes('å é¤åç')) {
        await guildLiLiLaUserRepository.delete(user);
        reply = `å é¤åçæå`;
      }
      if (usage?.includes('æå¤§ç­çº§')) {
        const max_level = usage.split(' ')[1];
        if (max_level) {
          user.max_level = Number.parseInt(max_level);
          await guildLiLiLaUserRepository.update(
            {
              gid: userID,
            },
            user,
          )
          reply = `ä¿®æ¹æå æå¤§ç­çº§ ${max_level}`;
        } else {
          reply = `ä¿®æ¹å¤±è´¥ æå¤§ç­çº§ ä¸è½ä¸ºç©º`;
        }
      }
      if (usage?.includes('æå¨é¨é')) {
        const guild = usage.split(' ')[1];
        if (guild) {
          user.guild = guild;
          await guildLiLiLaUserRepository.update(
            {
              gid: userID,
            },
            user,
          )
          reply = `ä¿®æ¹æå æå¨é¨é ${guild}`;
        } else {
          reply = `ä¿®æ¹å¤±è´¥ æå¨é¨é ä¸è½ä¸ºç©º`;
        }
      }
    } else {
      reply = `æ²¡ææ¾å°è¯¥ç¨æ·çåç`;
    }
  }
  return {reply,spread};
};
export default ffxivId;