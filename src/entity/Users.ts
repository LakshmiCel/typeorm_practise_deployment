import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Comment } from "./Comments";
import { Post } from "./Posts";
import { Like } from "./Likes";
import { Message } from "./Messages";
import { GroupDetail } from "./GroupDetails";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
  TRANSGENDER = "transgender",
  PREFER_NOT_TO_SAY = "prefer not to say",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: "user_id" })
  userId: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 30, unique: true })
  username: string;

  @Column({ length: 100, nullable: true })
  bio: string;

  @Column({ type: "enum", enum: Gender, default: Gender.PREFER_NOT_TO_SAY })
  gender: Gender;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255 })
  image_url: string;

  @Column({ length: 255 })
  avatar_url: string;

  @Column({ type: "date" })
  dob: Date;

  @OneToMany(() => Comment, (comment) => comment.user,{ cascade: true })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user,{ cascade: true })
  likes: Like[];

  @OneToMany(() => Message, (message) => message.sender,{ cascade: true })
  sent_messages: Message[];

  @OneToMany(() => Message, (message) => message.receiver,{ cascade: true })
  received_messages: Message[];

  @OneToMany(() => Post, (post) => post.user,{ cascade: true })
  posts: Post[];

  @ManyToMany(() => GroupDetail, (group) => group.members,{ cascade: true })
  @JoinTable()
  groups: GroupDetail[];
}
