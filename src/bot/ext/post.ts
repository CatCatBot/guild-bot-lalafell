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
      if (body.code) throw new Error(body);
    })
    .catch((error) => {
      console.error(error);
    });
}
