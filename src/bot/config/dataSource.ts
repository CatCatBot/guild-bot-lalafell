import { DataSource } from 'typeorm';
import { Message } from '../entities/message';

export const LalafellDataSource = new DataSource({
  type: 'sqlite',
  database: './lalafell.db',
  synchronize: true,
  entities: [Message],
});

LalafellDataSource.initialize()
  .then(() => {
    console.log('LalafellDataSource initialized');
  })
  .catch((error) => {
    console.error('LalafellDataSource initialization failed');
    console.error(error);
  });
