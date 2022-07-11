const queryFish = async (
  client: any,
  data: { eventType: string; msg: any },
  spread: boolean,
) => {
  if (data.eventType === 'MESSAGE_CREATE' && spread) {
    console.log(data);
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
    if (content?.includes('道具检索')) {
      const item = await require('./data/item.json');
      let fishName = content.split(' ')[1];
      let reply = '';
      let exist = false;
      if (fishName === '' || fishName === undefined) {
        const search = content.split(' ')[1];
        if (search !== undefined && search !== '') {
          fishName = search;
        }
      }
      console.info(`searching ${fishName}`);
      item.forEach((it: { [x: string]: string }) => {
        // console.info(item['9']);
        if (it['9'].includes(fishName)) {
          console.info(`${fishName} found`);
          reply =
            reply +
            it['9'] +
            ':\n' +
            it['8'] +
            '\n---------<emoji:318>---------\n';
          exist = true;
        }
      });
      if (!exist) {
        reply = '没有找到哦~';
      }
      client.messageApi.postMessage(channelID, {
        content: reply,
        msg_id: data.msg.id,
      });
      return true;
    }
  }
};
export default queryFish;
