import { AvailableIntentsEventsEnum } from 'qq-guild-bot';
import { secret } from './s.config';

const lalafellConfig = {
  appID: secret.appID,
  token: secret.token,
  intents: [
    AvailableIntentsEventsEnum.GUILD_MESSAGES,
    AvailableIntentsEventsEnum.GUILD_MESSAGE_REACTIONS,
  ],
  sandbox: false, // optional, default false
};
const baseConfig = {
  robotId: secret.robotId,
  imgDir: 'c://github//',
};
export { lalafellConfig, baseConfig };
