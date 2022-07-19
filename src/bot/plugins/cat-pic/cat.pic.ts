import axios from 'axios';
import * as fs from 'fs';
import { LalafellDataSource } from 'src/bot/config/dataSource';
import { baseConfig, pixivConfig } from 'src/bot/config/lalafell.config';
import { ChatImage } from 'src/bot/entities/chat.image';
import { posteDirectImage, postImage } from 'src/bot/ext/post';
import nsfw_detect from 'src/bot/utils/nsfw/nsfw';
import service from './service';

const chatImageRepository = LalafellDataSource.getRepository(ChatImage);
const catPic = async (
  client: any,
  data: { eventType: string; msg: any },
  spread: boolean,
) => {
  if (data.eventType === 'MESSAGE_CREATE' && spread) {
    console.log(data);
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
    if (content?.includes(`<@!${baseConfig.robotId}>`)) {
      if (content?.includes('pic')) {
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
        spread = false; // msg will not be spreaded to other plugins
      }
      if (content?.includes('拉拉肥')) {
        const max = await chatImageRepository.count();
        const random =  Math.floor(Math.random() * (max + 1))
        const imgRecord = await chatImageRepository.findOne({
          where: {
            id: random,
          },
        });
        const img = baseConfig.datasetDir+imgRecord.filename;
        postImage(data.msg, img);
      }
    }
  }
  if (data.eventType === 'DIRECT_MESSAGE_CREATE' && spread) {
    console.log(data);
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
      if (content?.includes('pic')) {
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
            if (data.msg.author.username === '喵喵酱大胜利'?isMeowMeowSFW(nsfw_result):isSFW(nsfw_result)) {
              posteDirectImage(data.msg, img);
            } else {
              console.log('NSFW detected');
            }
            console.log(nsfw_result);
          })
          .catch((error: any) => {
            console.error(error);
          });
        spread = false; // msg will not be spreaded to other plugins
      }
      if (content?.includes('拉拉肥')) {
        const max = await chatImageRepository.count();
        const random =  Math.floor(Math.random() * (max + 1))
        const imgRecord = await chatImageRepository.findOne({
          where: {
            id: random,
          },
        });
        const img = baseConfig.datasetDir+imgRecord.filename;
        posteDirectImage(data.msg, img);
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
