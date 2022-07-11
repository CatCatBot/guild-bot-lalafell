import { AvailableIntentsEventsEnum, IMessage } from 'qq-guild-bot';
import { baseConfig } from 'src/bot/config/lalafell.config';
// import item from './data/item.json';
import sqlite3 from 'sqlite3';
const roleEmoji = [307, 306, 277, 198, 206, 204, 185];
const rolePlay = async (
  client: any,
  data: { eventType: string; msg: any },
  spread: boolean,
) => {
  if (data.eventType.toString() === 'MESSAGE_CREATE' && spread) {
    console.log('loading role play...');
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
    if (content?.includes(`<@!${baseConfig.robotId}>`)) {
      try {
        if (content?.includes('/role')) {
          // 查询所有身份组
          const { data: rolesData } = await client.roleApi.roles(guildID);
          const roles = rolesData.roles;
          console.info(roles);
          const selectRoles = roles.filter(
            (role) =>
              !role.name.includes('创建者') &&
              !role.name.includes('管理员') &&
              !role.name.includes('普通成员'),
          );
          let rolesMsg =
            '长按或右击消息,\n通过添加对应表情,\n选择你的角色吧!\n';
          let emojiSort = 0;
          const roleIds = [];
          for (let index = 0; index < selectRoles.length; index++) {
            const role = selectRoles[index];
            roleIds.push(role.id);
            rolesMsg += `选择 <emoji:${roleEmoji[emojiSort]}> 领取 ${role.name}\n`;
            emojiSort++;
          }
          if (selectRoles.length === 0) {
            rolesMsg = '暂无可选身份组,请先添加~';
          }
          client.messageApi
            .postMessage(data.msg.channel_id, {
              content: rolesMsg,
              msg_id: data.msg.id,
            })
            .then((res) => {
              // use last msg id to add reaction
              sqlite3.verbose();
              const db = new sqlite3.Database('./data/role.db');
              console.info(res.data);
            })
            .catch(console.error);
        }
      } catch (e) {
        console.error(e);
        if (e.code === 11264) {
          client.messageApi.postMessage(data.msg.channel_id, {
            content:
              '莉莉菈权限不够啦，请在权限设置中，将机器人身份设置为管理员~\n（非子频道管理员）',
            msg_id: data.msg.id,
          });
        }
      }
    }
  } else if (data.eventType === 'MESSAGE_REACTION_ADD' && spread) {
    console.log(data);
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const messageID = data.msg.target.id;
    const emoji = data.msg.emoji.id;
    const userID = data.msg.user_id;
    const { data: data1 } = await client.guildApi.guildMember(guildID, userID);
    const nick = data1.nick;
    const { data: roleData } = await client.roleApi.roles(guildID);
    const roles = roleData.roles;
    const { data: targetMsg } = await client.messageApi.message(
      channelID,
      messageID,
    );
    // console.info(targetMsg);
    if (targetMsg.message.content.includes('选择你的角色吧')) {
      const { data: guildMember } = await client.guildApi.guildMember(
        guildID,
        userID,
      );
      let validRole = false;
      roleEmoji.find((emojiId) => {
        if (emojiId.toString() === emoji) {
          validRole = true;
          return true;
        }
      });
      if (validRole) {
        const roleIds = [];
        const { data: rolesData } = await client.roleApi.roles(guildID);
        const roles = rolesData.roles;
        console.info(roles);
        const selectRoles = roles.filter(
          (role) =>
            !role.name.includes('创建者') &&
            !role.name.includes('管理员') &&
            !role.name.includes('普通成员'),
        );
        for (let index = 0; index < selectRoles.length; index++) {
          const role = selectRoles[index];
          roleIds.push(role.id);
        }
        for (let index = 0; index < roleIds.length; index++) {
          const emojiId = roleEmoji[index];
          const roleId = roleIds[index];
          const role = roles.find((role) => role.id === roleId);
          if (emojiId.toString() === emoji) {
            if (
              guildMember.roles.includes(
                roles.find((role) => role.id === roleId)?.id.toString(),
              )
            ) {
              client.messageApi
                .postMessage(channelID, {
                  content: `${nick} 你已经是 ${role.name} 了<emoji:271>`,
                  msg_id: messageID,
                })
                .catch(console.error);
            } else {
              console.info('add role');
              await client.messageApi
                .postMessage(channelID, {
                  content: `${nick} 你选择了 ${role.name}<emoji:179>`,
                  msg_id: messageID,
                })
                .catch(console.error);
              client.memberApi.memberAddRole(
                guildID,
                roleId,
                userID,
                channelID,
              );
            }
          }
        }
      }
    }
    return true;
  }
};
export default rolePlay;
