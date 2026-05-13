import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { User } from "./User";

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  filename!: string;

  @Column()
  originalName!: string;

  @Column()
  mimetype!: string;

  @Column()
  size!: number;

  @Column()
  path!: string; // relative or absolute path on disk

  @Column({ nullable: true })
  url?: string; // if you want a public URL

  @ManyToOne(() => User, { nullable: true })
  user?: User; // who uploaded it

  @CreateDateColumn()
  uploadedAt!: Date;
}
