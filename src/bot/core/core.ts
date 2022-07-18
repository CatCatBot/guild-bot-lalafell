import catPic from '../plugins/cat-pic/cat.pic';
import ffxivDataset from '../plugins/ffxiv-dataset/ffxiv.dataset';
import queryFish from '../plugins/ffxiv-fish/ffxiv.fish';
import helpText from '../plugins/help-text/help.text';
import nlpReply from '../plugins/nlp-reply/nlp.reply';
import rolePlay from '../plugins/role-play/role-play';

const loadPlugins = async (
  client: any,
  data: { eventType: string; msg: any },
) => {
  console.info('loading plugins...');
  let spread = true;
  spread = await helpText(client, data, spread);
  spread = await catPic(client, data, spread);
  spread = await queryFish(client, data, spread);
  spread = await rolePlay(client, data, spread);
  spread = await ffxivDataset(client, data, spread);
  await nlpReply(client, data, spread);
  return spread;
};
export { loadPlugins };
