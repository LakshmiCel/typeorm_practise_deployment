import express from "express";
// import { User } from "./entity/User"; 
import { AppDataSource } from "./data-source";
import userRouter from "./routes/UserRoutes";
import { followRouter } from "./routes/followRoutes";
import { postRouter } from "./routes/postRoutes";
import { storyRouter } from "./routes/StoryRoutes";
import { likeRouter } from "./routes/likesRouter";
import { commentRouter } from "./routes/CommentRoutes";
import { messageRouter } from "./routes/messagesRouter";
import { groupDetailRouter } from "./routes/GroupDetails";
import { groupParticipantRouter } from "./routes/GroupParticipants";
import { groupMessageRouter } from "./routes/GroupMessages";

const app = express();
const PORT = 3000;


app.use(express.json());


app.use("/users", userRouter);
app.use("/followers", followRouter);
app.use("/posts", postRouter);
app.use("/story", storyRouter);
app.use("/likes", likeRouter);
app.use("/comments", commentRouter);
app.use("/private/messages", messageRouter);
app.use("/group/details", groupDetailRouter);
app.use("/group/messages",groupMessageRouter)
app.use("/group/participants", groupParticipantRouter); 

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error("Error connecting to the database:", error));
