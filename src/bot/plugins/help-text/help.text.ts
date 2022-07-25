import { baseConfig } from 'src/bot/config/lalafell.config';
import { postDirectMessage } from 'src/bot/ext/post';

const helpTextContent = '您好，莉莉菈为您服务！\n' +
'📕 私信||@bot help||帮助 可以查看帮助\n' +
'🌱 私信||@bot 名片 帮助 -> 可以查看名片相关帮助\n' +
'♥ 私信||@bot 随机拉拉肥 随机猫猫 可以获取随机图\n' +
'🌸 私信||@bot 花间集 可以获取随机花间集的诗词\n' +
'🐟 道具检索 鱼名 -> 可以查询鱼类\n' +
'👴 @bot /role -> 可以获取身份组\n' +
'🕐 @bot dc utterance intent -> 可以添加自定义意图\n' +
'🎗️ @bot aws intent answer -> 可以添加自定义回答 \n' +
'🪐 @bot train -> 可以重新训练NLP\n' +
'📔 @bot pic 搜索名称 -> 可以搜索Pixiv图片\n' +
'📗 @bot dataset 分类名称&[图片图片...] -> 可以添加自定义分类数据集\n' +
'📧 私信||@bot sendmail 收信人邮件地址 主题 邮件内容&[图片图片...]\n' ;

const helpText = async (
  client: any,
  data: { eventType: string; msg: any },
  spread: boolean,
) => {
  if (data.eventType === 'MESSAGE_CREATE' && spread) {
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
    if (content?.includes(`<@!${baseConfig.robotId}>`)) {
      if (content?.includes('help') || content?.includes('帮助')) {
        console.log('loading plugins help-text')
        spread = false; // msg will not be spreaded to other plugins
        // postImage(data.msg, 'help.png');
        client.messageApi.postMessage(channelID, {
          content: helpTextContent,
          msg_id: data.msg.id,
        });
      }
    }
  }
  if (data.eventType === 'DIRECT_MESSAGE_CREATE' && spread) {
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
      if (content?.includes('help') || content?.includes('帮助')) {
        console.log('loading plugins help-text')
        spread = false; // msg will not be spreaded to other plugins
        postDirectMessage(guildID,{
          content: helpTextContent,
          msg_id: data.msg.id,
        })
      }
    }
  return spread;
};
export default helpText;
