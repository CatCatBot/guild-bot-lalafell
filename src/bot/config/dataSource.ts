import { DataSource } from 'typeorm';
import { ChatImage } from '../entities/chat.image';
import { GuildLiLiLaUser } from '../entities/guild.lilila.user';
import { Message } from '../entities/message';
import { Words } from '../entities/words';

export const LalafellDataSource = new DataSource({
  type: 'sqlite',
  database: './lalafell.db',
  synchronize: true,
  entities: [Message, Words, ChatImage, GuildLiLiLaUser],
});

LalafellDataSource.initialize()
  .then(() => {
    console.log('LalafellDataSource initialized');
  })
  .catch((error) => {
    console.error('LalafellDataSource initialization failed');
    console.error(error);
  });
