import { NlpManager } from 'node-nlp';
import * as fs from 'fs';
import { LalafellDataSource } from 'src/bot/config/dataSource';
import { Words } from 'src/bot/entities/words';

const initTraning = async (isTraning: boolean) => {
  const manager = new NlpManager({ languages: ['zh'], forceNER: true });
  if (fs.existsSync('model.nlp')) {
    console.log('load nlp data from model.nlp');
    if (isTraning) {
      await trainFromDB(manager);
    } else {
      await manager.load('model.nlp');
    }
    return manager;
  }
  await trainFromDB(manager);
  // await trainFromMerge(manager);
  return manager;
};
export default initTraning;
async function trainFromDB(manager: any) {
  const documents = await LalafellDataSource.getRepository(Words).find({
    where: {
      type: 'document',
    },
  });
  documents.forEach((document) => {
    manager.addDocument(document.locale, document.utterance, document.intent);
  });
  const answers = await LalafellDataSource.getRepository(Words).find({
    where: {
      type: 'answer',
    },
  });
  answers.forEach((answer) => {
    manager.addAnswer(answer.locale, answer.intent, answer.answer);
  });
  await manager.train();
  manager.save();
}
async function trainFromMerge(manager: any) {
  manager.addDocument('zh', '再见', 'greetings.bye');
  manager.addDocument('zh', '一路小心', 'greetings.bye');
  manager.addDocument('zh', '好 拜拜', 'greetings.bye');
  manager.addDocument('zh', '我先走了', 'greetings.bye');
  manager.addDocument('zh', '还有事,先撤了', 'greetings.bye');
  manager.addDocument('zh', '你是?', 'greetings.who');
  manager.addDocument('zh', '你是谁?', 'greetings.who');
  manager.addDocument('zh', '你叫什么?', 'greetings.who');
  manager.addDocument('zh', '早', 'greetings.hello');
  manager.addDocument('zh', '你好', 'greetings.hello');
  manager.addDocument('zh', '好久不见', 'greetings.hello');

  // Train also the NLG
  manager.addAnswer('zh', 'greetings.bye', '回见！');
  manager.addAnswer('zh', 'greetings.bye', '后会有期！');
  manager.addAnswer('zh', 'greetings.hello', '你也好！');
  manager.addAnswer('zh', 'greetings.hello', '早安！');
  manager.addAnswer('zh', 'greetings.who', '莉莉菈！');
  manager.addAnswer(
    'zh',
    'greetings.who',
    '朕乃乌尔达哈第十七代国王,娜娜莫·乌尔娜莫.',
  );
  await manager.train();
  manager.save();
}
