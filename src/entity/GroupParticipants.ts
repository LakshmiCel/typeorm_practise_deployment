import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./Users";
import { GroupDetail } from "./GroupDetails";

@Entity()
export class GroupParticipant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GroupDetail, { onDelete: "CASCADE" })
  @JoinColumn({ name: "group_id", referencedColumnName: "groupId" })
  group: GroupDetail;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "participant_id", referencedColumnName: "userId" })
  participant: User;
}
