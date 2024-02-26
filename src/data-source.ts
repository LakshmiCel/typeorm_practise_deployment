import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/Users";
import { Post } from "./entity/Posts";
import { Message } from "./entity/Messages";
import { Like } from "./entity/Likes";
import { Followers } from "./entity/followers";
import { GroupDetail } from "./entity/GroupDetails";
import { GroupParticipant } from "./entity/GroupParticipants";
import { Comment } from "./entity/Comments";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1234",
  database: "insta_typeorm",
  synchronize: true,
  logging: false,
  entities: [
    User,
    Post,
    Message,
    Like,
    Followers,
    GroupDetail,
    GroupParticipant,
    Comment,
  ],
  migrations: [],
  subscribers: [],
});
