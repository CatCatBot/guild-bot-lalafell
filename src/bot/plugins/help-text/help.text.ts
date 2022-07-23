import { baseConfig } from 'src/bot/config/lalafell.config';

const helpText = async (
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
      if (content?.includes('help') || content?.includes('帮助')) {
        // postImage(data.msg, 'help.png');
        client.messageApi.postMessage(channelID, {
          content:
            '您好，莉莉菈为您服务！\n' +
            '📕 @bot help||帮助 可以查看帮助\n' +
            '🌱 @bot 名片 帮助 -> 可以查看名片相关帮助\n' +
            '♥ @bot 随机拉拉肥 随机猫猫 可以获取随机图\n' +
            '🌸 @bot 花间集 可以获取随机花间集的诗词\n' +
            '🐟 道具检索 鱼名 -> 可以查询鱼类\n' +
            '👴 @bot /role -> 可以获取身份组\n' +
            '🕐 @bot dc utterance intent -> 可以添加自定义意图\n' +
            '🎗️ @bot aws intent answer -> 可以添加自定义回答 \n' +
            '🪐 @bot train -> 可以重新训练NLP\n' +
            '📔 @bot pic 搜索名称 -> 可以搜索Pixiv图片\n' +
            '📗 @bot dataset 分类名称 [图片,图片, ...] -> 可以添加自定义分类数据集\n',
          msg_id: data.msg.id,
        });
        spread = false; // msg will not be spreaded to other plugins
      }
    }
  }
  return spread;
};
export default helpText;
