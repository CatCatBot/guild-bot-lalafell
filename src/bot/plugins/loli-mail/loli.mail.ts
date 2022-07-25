import axios from 'axios';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';
import { IMessage } from 'qq-guild-bot';
import { baseConfig, mailConfig } from 'src/bot/config/lalafell.config';
import {
  postDirectMessage,
} from 'src/bot/ext/post';

const loliMail = async (
  client: any,
  data: { eventType: string; msg: any },
  spread: boolean,
) => {
  if (data.eventType === 'MESSAGE_CREATE' && spread) {
    const channelID = data.msg.channel_id;
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
    if (content?.includes(`<@!${baseConfig.robotId}>`)) {
      if (content?.includes('sendmail')) {
        console.log('loading plugin');
        spread = false; // msg will not be spreaded to other plugins
        const params = content.split(' '); 
        const target = params[2];
        const subject = params[3];
        const msg = params[4];
        const attachments = data.msg.attachments;
        let attachmentsList = [];
        if (attachments?.length > 0) {
           for (let i =0; i< attachments.length; i++) {
              const attachment = attachments[i];
              const contentType = attachment.content_type;
              const fileName = attachment.filename;
              const fileUrl = "https://" + attachment.url;
              const pic = await axios.get(fileUrl, {
                responseType: 'arraybuffer',
              });
              fs.writeFileSync(__dirname + '/' + fileName, pic.data);
              attachmentsList.push({
                filename: fileName,
                path:__dirname + '/' + fileName,
                cid: fileName,
              })
           }
        }
        sendMail(target, subject, msg, data, attachmentsList)
        .then(() => {
          console.log('mail sent');
          client.messageApi.postMessage(channelID,{
            content: `<@!${data.msg.author.id}>邮件已发送!`,
            msg_id: data.msg.id,
          })
        })
      }
    }
 }
  if (data.eventType === 'DIRECT_MESSAGE_CREATE' && spread) {
    const guildID = data.msg.guild_id;
    const content = data.msg?.content;
    if (content?.includes('sendmail')) {
      console.log('loading plugin: sendmail');
      spread = false; // msg will not be spreaded to other plugins
      const params = content.split(' '); 
        const target = params[1];
        const subject = params[2];
        const msg = params[3];
        const attachments = data.msg.attachments;
        let attachmentsList = [];
        if (attachments?.length > 0) {
           for (let i =0; i< attachments.length; i++) {
              const attachment = attachments[i];
              const contentType = attachment.content_type;
              const fileName = attachment.filename;
              const fileUrl = attachment.url;
              const pic = await axios.get(fileUrl, {
                responseType: 'arraybuffer',
              });
              fs.writeFileSync(__dirname + '/' + fileName, pic.data);
              attachmentsList.push({
                filename: fileName,
                path:__dirname + '/' + fileName,
                cid: fileName,
              })
           }
        }
        sendMail(target, subject, msg, data, attachmentsList)
          .then(() => {
            console.log('mail sent');
            postDirectMessage(guildID,{
              content: `邮件已发送!`,
              msg_id: data.msg.id,
            })
          })
    }
  }
  return spread;
};
export default loliMail;

async function sendMail(target: string, subject:string, msg: string, data: { eventType: string; msg: IMessage; }, attachmentsList: any[]) {
  let transporter = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: false,
    auth: {
      user: mailConfig.auth.user,
      pass: mailConfig.auth.pass,
    },
    transactionLog: true, // include SMTP traffic in the logs
    logger: true, // log SMTP traffic
  }, 
  {
    from: `${data.msg.author.username} <${mailConfig.auth.user}>`,
  });
  let tc = require('text-censor');
  const filterText = await tc.filter(msg);
  const lililaProtect = '_________________________________________________\n本邮件由莉莉菈代发,不代表莉莉菈任何立场；来自qq频道[拉拉肥].';
  let message = {
    to: target,
    subject: subject,
    text: filterText + '\n' + lililaProtect,
    attachments: attachmentsList,
  }
  await transporter.sendMail(message);
}
