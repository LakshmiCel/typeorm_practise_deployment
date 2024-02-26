import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './Users';
import { Post } from './Posts';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  commentId: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(()=>Post)
  post:Post;

  @Column({ name: 'comment_text', length: 255 })
  commentText: string;

  @Column({ name: 'comment_timestamp', type: 'timestamp with time zone' })
  commentTimestamp: Date;

  @OneToMany(() => Comment, comment => comment.parentComment)
  replies: Comment[];

  @ManyToOne(() => Comment, comment => comment.replies)
  @JoinColumn({ name: 'reply_id' })
  parentComment: Comment;
}
