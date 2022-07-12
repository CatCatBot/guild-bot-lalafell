import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  mid: string;
  @Column()
  guild_id: string;
  @Column()
  channel_id: string;
  @Column()
  content: string;
  @Column({
    default: 0,
  })
  seq: number;
  @Column()
  seq_in_channel: string;
  @Column()
  timestamp: string;
  @Column()
  event_type: string;
  @Column()
  event_id: string;
  // msg author
  @Column()
  author_avatar: string;
  @Column()
  author_bot: boolean;
  @Column()
  author_id: string;
  @Column()
  author_username: string;
  // msg member
  @Column({
    default: '',
  })
  memner_joined_at: string;
  @Column({
    default: '',
  })
  meber_nick: string;
  @Column({
    default: '',
  })
  member_roles: string;
  @Column({
    default: 'nomal',
  })
  msg_label: string;
  @Column({
    default: '',
  })
  last_msg_id: string;
}
