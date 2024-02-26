import { ChatType, Message } from "../entity/Messages";
import { AppDataSource } from "./../data-source";
import { Request, Response, Router } from "express";

const groupMessageRouter = Router();
const messageRepository = AppDataSource.manager.getRepository(Message);

const getGroupMessages = async (req: Request, res: Response) => {
  try {
    const groupId = parseInt(req.params.group_id);
    const groupMessages = await messageRepository.find({
      where: { group: { groupId } },
      relations: ["group", "sender"],
    });
    res.json(groupMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGroupMessage = async (req: Request, res: Response) => {
  try {
    const messageId = parseInt(req.params.message_id);
    await messageRepository.delete(messageId);
    res.json({ message: "Group message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addGroupMessage = async (req: Request, res: Response) => {
  try {
    const { sender_id, group_id, message_text } = req.body;
    const newMessage = new Message();
    newMessage.sender = sender_id;
    newMessage.group = group_id;
    newMessage.messageText = message_text;
    newMessage.chatType = ChatType.GROUP;
    newMessage.timeMessageSent = new Date(); // Current time
    await messageRepository.save(newMessage);
    res.status(201).json({
      message: "Group message added successfully",
      groupMessage: newMessage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

groupMessageRouter.get("/:group_id", getGroupMessages);
groupMessageRouter.delete("/:message_id", deleteGroupMessage);
groupMessageRouter.post("/", addGroupMessage);

export { groupMessageRouter };
