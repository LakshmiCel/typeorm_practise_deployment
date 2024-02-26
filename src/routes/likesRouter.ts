import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Like } from "../entity/Likes";
// import { Post } from "../entity/Posts";

const likeRouter = express.Router();
const likeRepository = AppDataSource.manager.getRepository(Like);

const addLike = async (req: Request, res: Response) => {
  try {
    const { user_id, post_id } = req.body;

    const existingLike = await likeRepository.findOne({
      where: { user: { userId: user_id }, post: { postId: post_id } },
      relations: ["user", "post"],
    });
    console.log("like already there", existingLike);
    if (existingLike) {
      return res.status(400).json({ error: "Like already there" });
    }

    const newLike = new Like();
    newLike.user = user_id;
    newLike.post = post_id;
    newLike.likeTimestamp = new Date();

    await likeRepository.save(newLike);

    res.status(201).json({ message: "Like added successfully", like: newLike });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostLikes = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const postId = parseInt(post_id);

    const [likes, likeCount] = await likeRepository.findAndCount({
      where: { post: { postId: postId } },
      relations: ["user", "post"],
    });

    res.json({ likes, likeCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStoryLikes = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const postId = parseInt(post_id);

    const [likes, likeCount] = await likeRepository.findAndCount({
      where: { post: { postId: postId } },
    });

    res.json({ likes, likeCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteLike = async (req: Request, res: Response) => {
  try {
    const { post_id, user_id } = req.params;

    const postId = parseInt(post_id);
    const userId = parseInt(user_id);

    const likeToDelete = await likeRepository.findOne({
      where: { user: { userId: userId }, post: { postId: postId } },
    });

    if (!likeToDelete) {
      return res.status(404).json({ error: "Like not found" });
    }

    await likeRepository.remove(likeToDelete);

    res.json({ message: "Like deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

likeRouter.post("/", addLike);
likeRouter.get("/post/:post_id", getPostLikes);
likeRouter.get("/story/:post_id", getStoryLikes);
likeRouter.delete("/:post_id/:user_id", deleteLike);

export { likeRouter };
