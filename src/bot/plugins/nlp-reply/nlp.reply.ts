import { baseConfig } from 'src/bot/config/lalafell.config';
import { Nlp } from '@nlpjs/nlp';
import { LangZh } from '@nlpjs/lang-zh';
import * as fs from 'fs';
import initTraning from './nlp/init.train.nlp';

const nlp = new Nlp({ languages: ['zh'], plugins: [LangZh], debug: true });
nlp.container.register('fs', fs);
nlp.use(LangZh);
nlp.addLanguage('zh');
const nlpReply = async (
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
      await initTraning(nlp);
      const response = await nlp.process('zh', content.split(' ')[1]);
      console.log(response);
      await client.messageApi.postMessage(channelID, {
        content:
          response.answer === undefined ? '莉莉菈不知道哦' : response.answer,
        msg_id: data.msg.id,
      });
      spread = false; // msg will not be spreaded to other plugins
    }
  }
  return spread;
};
export default nlpReply;
