import axios from 'axios';
import * as fs from 'fs';
import { baseConfig, pixivConfig } from 'src/bot/config/lalafell.config';
import { postImage } from 'src/bot/ext/post';
import nsfw_detect from 'src/bot/utils/nsfw/nsfw';
import service from './service';

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
          img = await searchAndSave(content);
        } catch (error) {
          console.error(error);
        }
        const nsfw_result: any = await nsfw_detect(img);
        console.log(nsfw_result);
        if (isSFW(nsfw_result)) {
          postImage(data.msg, img);
        } else {
          console.log('NSFW detected');
        }
        console.log(nsfw_result);
        spread = false; // msg will not be spreaded to other plugins
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
async function searchAndSave(content: string): Promise<string> {
  let url = 'https://pixiv.cat/';
  // https://app-api.pixiv.net/v1/search/illust?word=1
  const key = content.split(' ')[2];
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
