import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GuildLiLiLaUser {
  @PrimaryGeneratedColumn()
  id: number;
  // 用户id
  @Column()
  gid: string;
  // 昵称
  @Column()
  nickname: string;
  // 头像
  @Column({
    default: '',
  })
  avatar: string;
   // 所在服务器
  @Column()
  server: string;
  // 所在部队
  @Column({
    default: '',
  })
  guild: string;
  // 最大等级
  @Column({
    default: 0,
  })
  max_level: number;
  // 擅长职业
  @Column({
    default: '',
  })
  jobs: string;
  // 加入时间
  @Column({
    default: '',
  })
  start_game_from: string;
  // 游玩时间
  @Column({
    default: '',
  })
  play_time: string;
  // 简介
  @Column({
    default: '',
  })
  slogan: string;
  // 好感度
  @Column({
    default: 0.00,
  })
  favorability: number;
  @CreateDateColumn()
  createdAt: Date;
}
