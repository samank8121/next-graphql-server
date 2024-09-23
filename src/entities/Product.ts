import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  caption!: string;

  @Column({ type: 'decimal' })
  price!: number;

  @Column()
  slug!: string;

  @Column()
  weight!: string;

  @Column()
  rate: number;

  @Column()
  description: string;

  @Column()
  imageSrc: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
