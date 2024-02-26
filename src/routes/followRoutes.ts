import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Followers } from "../entity/followers";

const followRouter = express.Router();
const followersRepository = AppDataSource.manager.getRepository(Followers);

const add_followers = async (req, res) => {
  try {
    const { from, to } = req.body;
    if (from === to) {
      return res.json("cannot follow  yourself");
    }
    const newFollower = new Followers();
    newFollower.fromUserUserId = from;
    newFollower.toUserUserId = to;

    await followersRepository.save(newFollower);

    res
      .status(201)
      .json({ message: "Follower added successfully", follower: newFollower });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const delete_followers = async (req, res) => {
  try {
    const { from, to } = req.body;

    const followerToDelete = await followersRepository.findOne({
      where: { fromUserUserId: from, toUserUserId: to },
    });

    if (!followerToDelete) {
      return res.status(404).json({ error: "Follower not found" });
    }

    await followersRepository.remove(followerToDelete);

    res.json({ message: "Follower deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const followers_list = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const userId = parseInt(user_id);

    const followers = await followersRepository.find({
      where: { toUserUserId: userId },
    });

    if (followers.length === 0) {
      res.json("no followers found");
    } else {
      res.json(followers);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const following_list = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const userId = parseInt(user_id);

    const followers = await followersRepository.find({
      where: { fromUserUserId: userId },
    });
    if (followers.length === 0) {
      res.json("no following found");
    } else {
      res.json(followers);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

followRouter.post("/", add_followers);
followRouter.delete("/:from_user_id/:to_user_id", delete_followers);
followRouter.get("/followers/:user_id", followers_list);
followRouter.get("/following/:user_id", following_list);

export { followRouter };
