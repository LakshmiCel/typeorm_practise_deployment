import { GroupDetail } from "../entity/GroupDetails";
import { AppDataSource } from "./../data-source";
import { Request, Response, Router } from "express";
const groupDetailRouter = Router();
const groupDetailRepository = AppDataSource.manager.getRepository(GroupDetail);

const getAllGroupDetaisl = async (req: Request, res: Response) => {
  try {
    const groupDetails = await groupDetailRepository.find({
      relations: ["groupParticipants", "messages", "members"],
    });
    res.json(groupDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
groupDetailRouter.get("/all", getAllGroupDetaisl);

const getGroupDetails = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.user_id);
    const groupDetails = await groupDetailRepository.find({
      where: { members: { userId } },
      relations: ["groupParticipants", "messages", "members"],
    });
    res.json(groupDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

groupDetailRouter.get("/:user_id", getGroupDetails);

const postGroupDetails = async (req: Request, res: Response) => {
  try {
    const { group_name } = req.body;
    const newGroupDetail = new GroupDetail();
    newGroupDetail.groupName = group_name;
    newGroupDetail.groupCreatedTimestamp = new Date();
    await groupDetailRepository.save(newGroupDetail);
    res.status(201).json({
      message: "Group detail added successfully",
      groupDetail: newGroupDetail,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
groupDetailRouter.post("/", postGroupDetails);

const putGroupDetail = async (req: Request, res: Response) => {
  try {
    const group_id = parseInt(req.params.group_id);
    const { group_name } = req.body;
    const groupDetailToUpdate = await groupDetailRepository.findOne({
      where: { groupId: group_id },
    });
    if (!groupDetailToUpdate) {
      return res.status(404).json({ error: "Group detail not found" });
    }
    groupDetailToUpdate.groupName = group_name;
    await groupDetailRepository.save(groupDetailToUpdate);
    res.json({
      message: "Group detail updated successfully",
      groupDetail: groupDetailToUpdate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
groupDetailRouter.put("/:group_id", putGroupDetail);

const deleteGroupDetail = async (req: Request, res: Response) => {
  try {
    const group_id = parseInt(req.params.group_id);
    const groupDetailToDelete = await groupDetailRepository.findOne({
      where: { groupId: group_id },
    });
    if (!groupDetailToDelete) {
      return res.status(404).json({ error: "Group detail not found" });
    }
    await groupDetailRepository.remove(groupDetailToDelete);
    res.json({ message: "Group detail deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
groupDetailRouter.delete("/:group_id", deleteGroupDetail);

export { groupDetailRouter };
