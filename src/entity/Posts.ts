// export class Post{
// post_id:number;
// user_id:number;
// post_image_url:string;
// caption:string;
// post_timestamp:string;
// story_or_post:string;
// }

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './Users';


@Entity()
export class Post {
  @PrimaryGeneratedColumn({ name: 'post_id' })
  postId: number;

  @ManyToOne(() => User, user => user.posts)
  user: User;

  @Column({ name: 'post_image_url', length: 255 })
  postImageUrl: string;

  @Column({ length: 255 ,nullable:true}) 
  caption: string;

  @Column({ name: 'post_timestamp', type: 'timestamp without time zone', default: () => "CURRENT_TIMESTAMP" })
  postTimestamp: Date;

  @Column({ name: 'story_or_post', length: 1 })
  storyOrPost: string;
}
