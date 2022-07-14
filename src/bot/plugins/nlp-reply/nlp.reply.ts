import { baseConfig } from 'src/bot/config/lalafell.config';
import { LalafellDataSource } from 'src/bot/config/dataSource';
import { Words } from 'src/bot/entities/words';
import initTraning from './nlp/init.train.nlp';

const wordsRepository = LalafellDataSource.getRepository(Words);
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
      if (content?.includes('dc')) {
        const utterance = content.split(' ')[2].trim();
        const intent = content.split(' ')[3].trim();
        //todo add to db
        const words = new Words();
        words.intent = intent;
        words.utterance = utterance;
        words.locale = 'zh';
        words.type = 'document';
        wordsRepository.save(words);
        client.messageApi.postMessage(channelID, {
          content: '感谢您的提交，莉莉菈将会尽快处理！',
          msg_id: data.msg.id,
        });
      } else if (content?.includes('aws')) {
        const intent = content.split(' ')[2].trim();
        const awser = content.split(' ')[3].trim();
        const words = new Words();
        words.intent = intent;
        words.answer = awser;
        words.locale = 'zh';
        words.type = 'answer';
        wordsRepository.save(words);
        client.messageApi.postMessage(channelID, {
          content: '感谢您的提交，莉莉菈将会尽快处理！',
          msg_id: data.msg.id,
        });
        //todo add to db
      } else if (content?.includes('train')) {
        // retrain nlp
        await client.messageApi.postMessage(channelID, {
          content: '正在重新训练NLP...',
          msg_id: data.msg.id,
        });
        await initTraning(true);
        await client.messageApi.postMessage(channelID, {
          content: '重新训练NLP完成！',
          msg_id: data.msg.id,
        });
      } else if (content?.includes('wls')) {
        // list all words
        const words = await wordsRepository.find();
        const content = words
          .map((word) => {
            return `${word.utterance}${word.answer} -> ${word.intent} @${word.type}`;
          })
          .join('\n');
        client.messageApi.postMessage(channelID, {
          content,
          msg_id: data.msg.id,
        });
      } else {
        const manager = await initTraning(false);
        const response = await manager.process('zh', content.split(' ')[1]);
        console.log(response);
        await client.messageApi.postMessage(channelID, {
          content:
            response.answer === undefined ? '莉莉菈不知道哦' : response.answer,
          msg_id: data.msg.id,
        });
      }
      spread = false; // msg will not be spreaded to other plugins
    }
  }
  return spread;
};
export default nlpReply;
