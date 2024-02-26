import { AppDataSource } from './../data-source';
import express, { Request, Response } from "express";
import { ChatType, Message } from "../entity/Messages";

const messageRouter = express.Router();
const messageRepository = AppDataSource.manager.getRepository(Message);

const getAllPrivateMessages = async (req: Request, res: Response) => {
    try {
      const messages = await messageRepository.find({
        where: { chatType: ChatType.PRIVATE },
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const deletePrivateMessage = async (req: Request, res: Response) => {
    try {
      const messageId = parseInt(req.params.message_id);
      const messageToDelete = await messageRepository.findOne({where:{messageId:messageId}});
      if (!messageToDelete) {
        return res.status(404).json({ error: "Message not found" });
      }
      await messageRepository.remove(messageToDelete);
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const addPrivateMessage = async (req: Request, res: Response) => {
    try {
      const { sender_id, receiver_id, message_text } = req.body;
      const newMessage = new Message();
      newMessage.sender = sender_id;
      newMessage.receiver = receiver_id;
      newMessage.messageText = message_text;
      newMessage.timeMessageSent = new Date();
      newMessage.chatType = ChatType.PRIVATE;
      await messageRepository.save(newMessage);
      res.status(201).json({ message: "Message added successfully", private_message: newMessage });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// // Delete a private message
// const deletePrivateMessage = async (req: Request, res: Response) => {
//   try {
//     const { message_id } = req.params;
//     const privateMessageToDelete = await messageRepository.findOne(message_id);
//     if (!privateMessageToDelete || privateMessageToDelete.chatType !== "private") {
//       return res.status(404).json({ error: "Private message not found" });
//     }
//     await messageRepository.remove(privateMessageToDelete);
//     res.json({ message: "Private message deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

messageRouter.get("/:sender_id/:receiver_id", getAllPrivateMessages);
messageRouter.post("/", addPrivateMessage);
messageRouter.delete("/:message_id", deletePrivateMessage);

export { messageRouter };
