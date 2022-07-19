import axios from 'axios';
import * as fs from 'fs';
import { LalafellDataSource } from 'src/bot/config/dataSource';
import { baseConfig, pixivConfig } from 'src/bot/config/lalafell.config';
import { ChatImage } from 'src/bot/entities/chat.image';
import { postDirectMessage } from 'src/bot/ext/post';

const chatImageRepository = LalafellDataSource.getRepository(ChatImage);
const ffxivDataset = async (
  client: any,
  data: { eventType: string; msg: any },
  spread: boolean,
) => {
  console.log('loading plugin: ffxiv dataset...');
  if (data.eventType === 'MESSAGE_CREATE' && spread || data.eventType === 'DIRECT_MESSAGE_CREATE' && spread) {
    console.log(data);
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
    const attachments = data.msg?.attachments;
    if (content?.includes(`<@!${baseConfig.robotId}>`) || data.eventType === 'DIRECT_MESSAGE_CREATE') {
      if (content?.includes('dataset')) {
        // postImage(data.msg, 'help.png');
        const params = content.split(' ');
        let chatImage = new ChatImage();
        // save to db
        for (let index = 0; index < attachments.length; index++) {
          const attachment = attachments[index];
          chatImage.cid = attachment.id;
          chatImage.content_type = attachment.content_type;
          chatImage.filename = attachment.filename;
          chatImage.size = attachment.size;
          chatImage.url = attachment.url;
          chatImage.height = attachment.height;
          chatImage.width = attachment.width;
          if(data.msg.direct_message) {
            chatImage.type =  data.msg.content.split(' ')[1];
          } else {
            chatImage.type =  data.msg.content.split(' ')[2];
          }
          // save to db
          chatImageRepository.save(chatImage);
          // save to file
          const pic = await axios.get('https://'+chatImage.url, {
            responseType: 'arraybuffer',
          });
          if(!fs.existsSync(baseConfig.datasetDir +chatImage.type)){
            fs.mkdirSync(baseConfig.datasetDir +chatImage.type);
          }
          fs.writeFileSync(baseConfig.datasetDir +chatImage.type + '/' + chatImage.filename, pic.data);
        }
        if(data.msg.direct_message){
          postDirectMessage(guildID,{
            content: '保存成功',
            msg_id: data.msg.id,
          })
        }else {
          client.messageApi.postMessage(channelID, {
            content: '保存成功',
            msg_id: data.msg.id,
          });
        }
        spread = false; // msg will not be spreaded to other plugins
      }
    }
  }
  return spread;
};
export default ffxivDataset;
// async function searchAndSave(content: string): Promise<string> {
//   let url = 'https://pixiv.cat/';
//   // https://app-api.pixiv.net/v1/search/illust?word=1
//   const key = content.split(' ')[2];
//   const bearer = await service.getBearer(pixivConfig.freshToken);
//   console.info('b:' + bearer + ' ?');
//   const pixivID = await service.getSearch(encodeURI(key), bearer);
//   console.info(pixivID);
//   if (pixivID == 'undfined' || pixivID == undefined) {
//     return '';
//   }
//   url += pixivID + '.jpg';
//   // save to local
//   const pic = await axios.get(url, {
//     responseType: 'arraybuffer',
//   });
//   fs.writeFileSync(__dirname + '/' + pixivID + '.jpg', pic.data);
//   return __dirname + '/' + pixivID + '.jpg';
// }
