import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatImage {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  cid: string;
  @Column()
  content_type: string;
  @Column()
  filename: string;
  @Column()
  height: string;
  @Column()
  width: string;
  @Column()
  url: string;
  @Column()
  size: string;
  @Column({
    default: '',
  })
  type: string;
  @CreateDateColumn()
  createdAt: Date;
}
