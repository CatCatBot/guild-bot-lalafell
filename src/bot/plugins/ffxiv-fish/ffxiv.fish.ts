import { IMessage } from 'qq-guild-bot';
// import item from './data/item.json';

const queryFish = async (msg: IMessage, fishName: string) => {
  const item = await import('./data/item.json');
  const content = msg.content;
  console.info(content);
  let reply = '';
  let exist = false;
  if (fishName === '' || fishName === undefined) {
    const search = content.split(' ')[1];
    if (search !== undefined && search !== '') {
      fishName = search;
    }
  }
  console.info(`searching ${fishName}`);
  item.forEach((it) => {
    // console.info(item['9']);
    if (it['9'].includes(fishName)) {
      console.info(`${fishName} found`);
      reply =
        reply + it['9'] + ':\n' + it['8'] + '\n---------<emoji:318>---------\n';
      exist = true;
    }
  });
  if (!exist) {
    reply = '没有找到哦~';
  }
  return reply;
};
export default queryFish;
