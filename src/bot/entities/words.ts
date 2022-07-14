import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Words {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    default: 'zh',
  })
  locale: string;
  @Column({
    default: undefined,
  })
  utterance: string;
  @Column({
    default: undefined,
  })
  answer: string;
  @Column()
  intent: string;
  @Column({
    default: undefined,
  })
  opts: string;
  @Column({
    enum: ['document', 'answer'],
  })
  type: string;
  @CreateDateColumn()
  createdAt: Date;
}
