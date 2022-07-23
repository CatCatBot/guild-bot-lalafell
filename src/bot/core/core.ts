import catPic from '../plugins/cat-pic/cat.pic';
import ffxivDataset from '../plugins/ffxiv-dataset/ffxiv.dataset';
import queryFish from '../plugins/ffxiv-fish/ffxiv.fish';
import ffxivId from '../plugins/ffxiv-id/ffxiv.id';
import helpText from '../plugins/help-text/help.text';
import huajianji from '../plugins/huajianji/huajianji';
import nlpReply from '../plugins/nlp-reply/nlp.reply';
import rolePlay from '../plugins/role-play/role-play';

const loadPlugins = async (
  client: any,
  data: { eventType: string; msg: any },
) => {
  console.log(data);
  console.info('loading plugins...');
  let spread = true;
  spread = await huajianji(client, data, spread);
  console.log(`after huajianji: ${spread}`);
  spread = await ffxivId(client, data, spread);
  console.log(`after ffxivId: ${spread}`);
  spread = await catPic(client, data, spread);
  console.log(`after catPic: ${spread}`);
  spread = await queryFish(client, data, spread);
  console.log(`after queryFish: ${spread}`);
  spread = await rolePlay(client, data, spread);
  console.log(`after rolePlay: ${spread}`);
  spread = await rolePlay(client, data, spread);
  console.log(`after rolePlay: ${spread}`);
  spread = await ffxivDataset(client, data, spread);
  console.log(`after ffxivDataset: ${spread}`);
  spread = await helpText(client, data, spread);
  console.log(`after hlet-text:` + spread)
  await nlpReply(client, data, spread);
  return spread;
};
export { loadPlugins };
