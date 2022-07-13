import * as fs from 'fs';
import { Nlp } from '@nlpjs/nlp';

const initTraning = async (manager: Nlp) => {
  if (fs.existsSync('./model.nlp')) {
    console.log('load nlp data from ./model.nlp');
    await manager.load('./model.nlp');
    return;
  }
  manager.addDocument('zh', '再见', '问候.再见');
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
  manager.addAnswer('zh', '问候.再见', '回见！');
  manager.addAnswer('zh', '问候.再见', '后会有期！');
  manager.addAnswer('zh', 'greetings.hello', '你也好！');
  manager.addAnswer('zh', 'greetings.hello', '早安！');
  manager.addAnswer('zh', 'greetings.who', '莉莉菈！');
  manager.addAnswer(
    'zh',
    'greetings.who',
    '朕乃乌尔达哈第十七代国王,娜娜莫·乌尔娜莫.',
  );
  manager.save();
};
export default initTraning;
