import { GroupParticipant } from "../entity/GroupParticipants";
import { AppDataSource } from "./../data-source";
import { Request, Response, Router } from "express";

const groupParticipantRouter = Router();
const groupParticipantRepository =
  AppDataSource.manager.getRepository(GroupParticipant);

const getGroupParticipants = async (req: Request, res: Response) => {
  try {
    const groupParticipants = await groupParticipantRepository.find({
      relations: ["group", "participant"],
    });
    res.json(groupParticipants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGroupParticipantsById = async (req: Request, res: Response) => {
  try {
    const groupId = parseInt(req.params.group_id);
    const groupParticipants = await groupParticipantRepository.find({
      where: { group: { groupId: groupId } },
      relations: ["group", "participant"],
    });
    res.json(groupParticipants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addGroupParticipants = async (req: Request, res: Response) => {
  try {
    const { group_id, participant_id } = req.body;
    const newGroupParticipant = new GroupParticipant();
    newGroupParticipant.group = group_id;
    newGroupParticipant.participant = participant_id;
    const existingParticipant = await groupParticipantRepository.findOne({
      where: {
        group: { groupId: group_id },
        participant: { userId: participant_id },
      },
    });
    console.log(existingParticipant);

    if (existingParticipant) {
      return res.status(400).json({ message: "User already in group" });
    }
    await groupParticipantRepository.save(newGroupParticipant);
    res.status(201).json({
      message: "Group participant added successfully",
      groupParticipant: newGroupParticipant,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteGroupParticipant = async (req: Request, res: Response) => {
  try {
    const participantId: number = parseInt(req.params.participant_id);
    const groupId: number = parseInt(req.params.group_id);

    const groupParticipantToDelete = await groupParticipantRepository.findOne({
      where: { group: { groupId }, participant: { userId: participantId } },
    });

    if (!groupParticipantToDelete) {
      return res.status(404).json({ error: "Group participant not found" });
    }

    await groupParticipantRepository.remove(groupParticipantToDelete);

    res.json({ message: "Group participant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

groupParticipantRouter.get("/", getGroupParticipants);
groupParticipantRouter.get("/:group_id", getGroupParticipantsById);
groupParticipantRouter.post("/", addGroupParticipants);
groupParticipantRouter.delete(
  "/:group_id/:participant_id",
  deleteGroupParticipant
);

export { groupParticipantRouter };
