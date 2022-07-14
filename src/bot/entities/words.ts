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
    default: '',
  })
  utterance: string;
  @Column({
    default: '',
  })
  answer: string;
  @Column()
  intent: string;
  @Column({
    default: '',
  })
  opts: string;
  @Column({
    enum: ['document', 'answer'],
  })
  type: string;
  @CreateDateColumn()
  createdAt: Date;
}
