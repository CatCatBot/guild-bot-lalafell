import queryFish from '../plugins/ffxiv-fish/ffxiv.fish';
import rolePlay from '../plugins/role-play/role-play';

const loadPlugins = async (
  client: any,
  data: { eventType: string; msg: any },
) => {
  console.info('loading plugins...');
  let spread = true;
  // spread = await queryFish(client, data, spread);
  spread = await rolePlay(client, data, spread);
  return spread;
};
export { loadPlugins };
