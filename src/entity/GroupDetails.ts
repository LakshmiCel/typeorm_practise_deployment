import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { GroupParticipant } from "./GroupParticipants"; // Import the GroupParticipant entity if it exists
import { Message } from "./Messages"; // Import the Message entity if it exists
import { User } from "./Users";

@Entity()
export class GroupDetail {
  @PrimaryGeneratedColumn({ name: "group_id" })
  groupId: number;

  @Column({ name: "group_name", length: 255 })
  groupName: string;

  @Column({
    name: "group_created_timestamp",
    type: "timestamp without time zone",
  })
  groupCreatedTimestamp: Date;

  @OneToMany(
    () => GroupParticipant,
    (groupParticipant) => groupParticipant.group,
    { cascade: true }
  )
  groupParticipants: GroupParticipant[];


  @OneToMany(() => Message, (message) => message.group)
  messages: Message[];

  @ManyToMany(() => User, (user) => user.groups)
  members: User[];
}
