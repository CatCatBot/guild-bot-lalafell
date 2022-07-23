import * as fs from 'fs';
import { baseConfig } from 'src/bot/config/lalafell.config';
import {
  postDirectMessage,
} from 'src/bot/ext/post';
import { Poery } from 'src/bot/typing/typing';

const huajianji = async (
  client: any,
  data: { eventType: string; msg: any },
  spread: boolean,
) => {
  if (data.eventType === 'MESSAGE_CREATE' && spread) {
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
    if (content?.includes(`<@!${baseConfig.robotId}>`)) {
      if (content?.includes('花间集')) {
        console.log('loading plugin: huajianji ...');
        spread = false; // msg will not be spreaded to other plugins
        const poem = getPoem();
        client.messageApi.postMessage(channelID,{
          content: poem,
          msg_id: data.msg.id,
        })
      }
    }
  }
  if (data.eventType === 'DIRECT_MESSAGE_CREATE' && spread) {
    console.log(data);
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
    if (content?.includes('花间集')) {
      console.log('loading plugin: huajianji ...');
      spread = false; // msg will not be spreaded to other plugins
      const poem = getPoem();
      postDirectMessage(guildID,{
        content: poem,
        msg_id: data.msg.id,
      })
    }
  }
  return spread;
};
export default huajianji;

function getPoem() {
  const huajianji_1 = fs.readFileSync(
    __dirname+'/data/huajianji-1-juan.json',
    'utf8',
  );
  const huajianji_2 = fs.readFileSync(
    __dirname+'/data/huajianji-2-juan.json',
    'utf8',
  );
  const huajianji_3 = fs.readFileSync(
    __dirname+'/data/huajianji-3-juan.json',
    'utf8',
  );
  const huajianji_4 = fs.readFileSync(
    __dirname+'/data/huajianji-4-juan.json',
    'utf8',
  ); 
  const huajianji_5 = fs.readFileSync(
    __dirname+'/data/huajianji-5-juan.json',
    'utf8',
  );
  const huajianji_6 = fs.readFileSync(
    __dirname+'/data/huajianji-6-juan.json',
    'utf8',
  );
  const huajianji_7 = fs.readFileSync(
    __dirname+ '/data/huajianji-7-juan.json',
    'utf8',
  );
  const huajianji_8 = fs.readFileSync(
    __dirname+'/data/huajianji-8-juan.json',
    'utf8',
  );
  const huajianji_9 = fs.readFileSync(
    __dirname+'/data/huajianji-9-juan.json',
    'utf8',
  );
  const huajianji_10 = fs.readFileSync(
    __dirname+'/data/huajianji-x-juan.json',
    'utf8',
  );
  const list = [huajianji_1, huajianji_2, huajianji_3, huajianji_4, huajianji_5, huajianji_6, huajianji_7, huajianji_8, huajianji_9, huajianji_10];
  const random = Math.floor(Math.random() * list.length);
  const huajianji = JSON.parse(list[random]);
  const random_poery:Poery = huajianji[Math.floor(Math.random() * huajianji.length)];
  console.log(random_poery);
  const poem = '🌸🌸🌸\n' + random_poery.rhythmic + '\n' + 
               random_poery.author + '\n\n' +
               random_poery.paragraphs.join('\n') +
               '\n----------------------------------------------------\n' +
               random_poery.notes.join('\n') +
               '\n----------------------------------------------------\n' +
               '🌸🌸🌸\n';
  return poem;
}
