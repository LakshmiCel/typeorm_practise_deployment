import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./Users";
import { Post } from "./Posts";

@Entity()
export class Like {
  @PrimaryGeneratedColumn({ name: "like_id" })
  likeId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Post,{ cascade: true })
  post: Post;

  @Column({ name: "like_timestamp", type: "timestamp without time zone" })
  likeTimestamp: Date;
}
