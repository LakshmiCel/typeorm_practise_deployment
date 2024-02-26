// import { Timestamp } from "typeorm";

// export class Message{
//     chat_type:string;
//     sender_id:number;
//     reciever_id:number;
//     message:string;
//     group_id:number;
//     time_message_sent:Timestamp;
// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./Users";
import { GroupDetail } from "./GroupDetails";

export enum ChatType {
  GROUP = "group",
  PRIVATE = "private",
}

@Entity()
export class Message {
  @PrimaryGeneratedColumn({ name: "message_id" })
  messageId: number;

  @Column({ name: "message_text", type: "text" })
  messageText: string;

  @Column({ name: "time_message_sent", type: "timestamp with time zone" })
  timeMessageSent: Date;

  @Column({ name: "chat_type", type: "enum", enum: ChatType })
  chatType: ChatType;

  @ManyToOne(() => User, (user) => user.sent_messages)
  @JoinColumn({ name: "sender_id" })
  sender: User;

  @ManyToOne(() => User, (user) => user.received_messages, { nullable: true })
  @JoinColumn({ name: "receiver_id" })
  receiver: User;

  @ManyToOne(() => GroupDetail, (group) => group.messages, { cascade: true })
  @JoinColumn({ name: "group_id" })
  group: GroupDetail;
}
