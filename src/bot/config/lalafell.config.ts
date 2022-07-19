import { AvailableIntentsEventsEnum } from 'qq-guild-bot';
import { secret, nomalConfig } from './s.config';

const lalafellConfig = {
  appID: secret.appID,
  token: secret.token,
  intents: [
    AvailableIntentsEventsEnum.GUILD_MESSAGES,
    AvailableIntentsEventsEnum.GUILD_MESSAGE_REACTIONS,
    AvailableIntentsEventsEnum.DIRECT_MESSAGE,
  ],
  sandbox: false, // optional, default false
};
const baseConfig = {
  robotId: secret.robotId,
  imgDir: 'c://github//',
  datasetDir: nomalConfig.datasetDir,
};

const pixivConfig = {
  freshToken: secret.freshToken,
};
export { lalafellConfig, baseConfig, pixivConfig };
