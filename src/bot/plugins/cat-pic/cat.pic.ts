import axios from 'axios';
import * as fs from 'fs';
import { LalafellDataSource } from 'src/bot/config/dataSource';
import { baseConfig, pixivConfig } from 'src/bot/config/lalafell.config';
import { ChatImage } from 'src/bot/entities/chat.image';
import {
  postDirectMessage,
  posteDirectImage,
  postImage,
} from 'src/bot/ext/post';
import nsfw_detect from 'src/bot/utils/nsfw/nsfw';
import service from './service';

const chatImageRepository = LalafellDataSource.getRepository(ChatImage);
const catPic = async (
  client: any,
  data: { eventType: string; msg: any },
  spread: boolean,
) => {
  if (data.eventType === 'MESSAGE_CREATE' && spread) {
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
    if (content?.includes(`<@!${baseConfig.robotId}>`)) {
      if (content?.includes('pic')) {
        console.log('loading plugin: cat-pic ... from pixiv');
        spread = false; // msg will not be spreaded to other plugins
        // postImage(data.msg, 'help.png');
        const params = content.split(' ');
        let img = 'C://Users//woshi//Pictures//barbara.jpg';
        try {
          img = await searchAndSave(content.split(' ')[2]);
        } catch (error) {
          console.error(error);
        }
        nsfw_detect(img)
          .then((nsfw_result: any) => {
            console.log(nsfw_result);
            if (isSFW(nsfw_result)) {
              postImage(data.msg, img);
            } else {
              console.log('NSFW detected');
            }
            console.log(nsfw_result);
          })
          .catch((error: any) => {
            console.error(error);
          });
      }
      let randomContent = content.split(' ')[1];
      if (randomContent?.includes('随机')) {
        console.log('loading plugin: cat-pic ...');
        spread = false; // msg will not be spreaded to other plugins
        let raceType = randomContent.replace('随机', '').trim();
        const max = await chatImageRepository.count();
        let random = 0;
        switch (raceType) {
          case '拉拉肥':
            raceType = '拉拉肥';
            random = Math.floor(Math.random() * (11570 + 1));
            break;
          case '猫猫':
            raceType = 'Miqote';
            random = Math.floor(Math.random() * (max - 11570  + 1) + 11570);
            break;
          default:
            raceType = '拉拉肥';  
            random = Math.floor(Math.random() * (11570 + 1));
        }
        client.messageApi.postMessage(channelID, {
          content: '正在搜索... 请稍后',
          msg_id: data.msg.id,
        });
        console.log(raceType + '->' + random);
        const imgRecord = await chatImageRepository.findOne({
          where: {
            id: random,
            type: raceType,
          },
        });
        if (imgRecord) {
          const img = baseConfig.datasetDir + raceType + '/' + imgRecord.filename;
          postImage(data.msg, img);
        } else {
          console.log('no record');
          client.messageApi.postMessage(channelID, {
            content: '没有找到图片',
            msg_id: data.msg.id,
          });
        }
        
      }
    }
  }
  if (data.eventType === 'DIRECT_MESSAGE_CREATE' && spread) {
    console.log(data);
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
    if (content?.includes('pic')) {
      console.log('loading plugin: cat-pic ... from pixiv');
      spread = false; // msg will not be spreaded to other plugins
      // postImage(data.msg, 'help.png');
      let img = '';
      try {
        img = await searchAndSave(content.split(' ')[1]);
      } catch (error) {
        console.error(error);
      }
      nsfw_detect(img)
        .then((nsfw_result: any) => {
          console.log(nsfw_result);
          if (
            data.msg.author.username === '喵喵酱大胜利'
              ? isMeowMeowSFW(nsfw_result)
              : isSFW(nsfw_result)
          ) {
            posteDirectImage(data.msg, img);
          } else {
            console.log('NSFW detected');
          }
          console.log(nsfw_result);
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
    if (content?.includes('随机')) {
      console.log('loading plugin: cat-pic ...');
      spread = false; // msg will not be spreaded to other plugins
      let raceType = content.replace('随机', '').trim();
      const max = await chatImageRepository.count();
      // fixme: code below is not soft to use
      let random = Math.floor(Math.random() * (max - 11570  + 1) + 11570);
      switch (raceType) {
        case '拉拉肥':
          raceType = '拉拉肥';
          random = Math.floor(Math.random() * (11570 + 1));
          break;
        case '猫猫':
          raceType = 'Miqote';
          random = Math.floor(Math.random() * (max - 11570  + 1) + 11570);
          break;
        default:
          raceType = '拉拉肥';  
          random = Math.floor(Math.random() * (11570 + 1));
      }
      console.log(raceType + '->' + random);
      postDirectMessage(data.msg.guild_id, {
        content: '正在搜索... 请稍后',
        msg_id: data.msg.id,
      });
      const imgRecord = await chatImageRepository.findOne({
        where: {
          id: random,
          type: raceType,
        },
      });
      if (imgRecord) {
        const img = baseConfig.datasetDir + raceType+ '/' + imgRecord.filename;
        posteDirectImage(data.msg, img);
      } else {
        console.log('no record');
        postDirectMessage(data.msg.guild_id, {
          content: '没有找到图片',
          msg_id: data.msg.id,
        });
      }
    }
  }
  return spread;
};
export default catPic;
function isSFW(nsfw_result: any) {
  return (
    Number.parseFloat(nsfw_result.Hentai) < 0.5 &&
    Number.parseFloat(nsfw_result.Porn) < 0.5 &&
    Number.parseFloat(nsfw_result.Sexy) < 0.5
  );
}
function isMeowMeowSFW(nsfw_result: any) {
  return (
    Number.parseFloat(nsfw_result.Hentai) < 0.8 &&
    Number.parseFloat(nsfw_result.Porn) < 0.8 &&
    Number.parseFloat(nsfw_result.Sexy) < 0.8
  );
}
async function searchAndSave(key: string): Promise<string> {
  let url = 'https://pixiv.cat/';
  // https://app-api.pixiv.net/v1/search/illust?word=1
  // const key = content.split(' ')[2];
  const bearer = await service.getBearer(pixivConfig.freshToken);
  console.info('b:' + bearer + ' ?');
  const pixivID = await service.getSearch(encodeURI(key), bearer);
  console.info(pixivID);
  if (pixivID == 'undfined' || pixivID == undefined) {
    return '';
  }
  url += pixivID + '.jpg';
  // save to local
  const pic = await axios.get(url, {
    responseType: 'arraybuffer',
  });
  fs.writeFileSync(__dirname + '/' + pixivID + '.jpg', pic.data);
  return __dirname + '/' + pixivID + '.jpg';
}
