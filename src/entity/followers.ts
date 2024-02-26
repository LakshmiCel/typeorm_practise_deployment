import { Entity, PrimaryColumn, Column, ManyToOne } from "typeorm";
import { User } from "./Users";

@Entity()
export class Followers {
  @PrimaryColumn({ nullable: false })
  fromUserUserId: number;

  @PrimaryColumn({ nullable: false })
  toUserUserId: number;

  @ManyToOne(() => User, { nullable: false })
  fromUser: User;

  @ManyToOne(() => User, { nullable: false })
  toUser: User;

  @Column({ name: "follow_timestamp", type: "timestamp without time zone", default: () => "CURRENT_TIMESTAMP" })
  followTimestamp: Date;
}
