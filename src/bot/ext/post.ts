// source from https://github.com/tencent-connect/bot-node-sdk/issues/76
import { IMessage } from 'qq-guild-bot';
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as FormData from 'form-data';
import { secret } from '../config/s.config';
import { baseConfig } from '../config/lalafell.config';
export async function postImage(msg: IMessage, picName: string) {
  picName = picName;
  console.debug(`uploading ${picName}`);
  const picData = fs.createReadStream(picName);
  const formdata = new FormData();
  formdata.append('msg_id', msg.id);
  formdata.append('file_image', picData);
  await fetch(`https://api.sgroup.qq.com/channels/${msg.channel_id}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': formdata.getHeaders()['content-type'],
      Authorization: `Bot ${secret.appID}.${secret.token}`,
    },
    body: formdata,
  })
    .then(async (res) => {
      const body: any = await res.json();
      if (body.code) throw new Error(body.message);
    })
    .catch((error) => {
      console.error(error);
    });
}
export async function posteDirectImage(msg: IMessage, picName: string) {
  picName = picName;
  console.debug(`uploading ${picName}`);
  const picData = fs.createReadStream(picName);
  const formdata = new FormData();
  formdata.append('msg_id', msg.id);
  formdata.append('file_image', picData);
  await fetch(`https://api.sgroup.qq.com/dms/${msg.guild_id}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': formdata.getHeaders()['content-type'],
      Authorization: `Bot ${secret.appID}.${secret.token}`,
    },
    body: formdata,
  })
    .then(async (res) => {
      const body: any = await res.json();
      if (body.code) throw new Error(body);
    })
    .catch((error) => {
      console.error(error);
    });
}
// export async function createThread(thred:Thread) {
// }

export async function createDirectMessage(recipient_id:string, source_guild_id:string){
  console.debug(`creating direct message to ${recipient_id}`);
  await fetch(`https://api.sgroup.qq.com/users/@me/dms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${secret.appID}.${secret.token}`,
    },
    body: JSON.stringify({
      recipient_id,
      source_guild_id,
    }),
  })
    .then(async (res) => {
      console.debug(res);
      return res;
    }
    )
}

export async function postDirectMessage(guild_id:string, data:{content:string, msg_id:string, [propName: string]: any;}) {
  await fetch(`https://api.sgroup.qq.com/dms/${guild_id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${secret.appID}.${secret.token}`,
        },
        body: JSON.stringify(data),
    }  ).then(res => res);
}