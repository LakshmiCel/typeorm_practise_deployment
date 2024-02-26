import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Post } from "../entity/Posts";

const storyRouter = express.Router();
const postRepository = AppDataSource.manager.getRepository(Post);

const add_story = async (req: Request, res: Response) => {
  try {
    const { user_id, post_image_url, caption } = req.body;

    const newPost = new Post();
    newPost.user = user_id;
    newPost.postImageUrl = post_image_url;
    newPost.caption = caption;
    newPost.storyOrPost = 'S';

    await postRepository.save(newPost);

    res.status(201).json({ message: "Story added successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const get_story = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const userId = parseInt(user_id);

    const story = await postRepository.find({
      where: { user: { userId }, storyOrPost: "S" },
      relations: ["user"],
    });

    if (story.length === 0) {
      res.json("no story found");
    } else {
      res.json(story);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const get_story_by_id = async (req: Request, res: Response) => {
  try {
    const { user_id, post_id } = req.params;

    const userId = parseInt(user_id);
    const postId = parseInt(post_id);

    const post = await postRepository.findOne({
      where: { user: { userId }, postId: postId, storyOrPost: "S" },
      relations: ["user"],
    });

    if (!post) {
      res.status(404).json("Story not found");
    } else {
      res.json(post);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const delete_story = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const userId = parseInt(user_id);

    await postRepository.delete({ user: { userId } });

    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const delete_story_by_id = async (req: Request, res: Response) => {
  try {
    const { user_id, post_id } = req.params;

    const userId = parseInt(user_id);
    const postId = parseInt(post_id);

    const result = await postRepository.delete({
      user: { userId },
      postId: postId,
    });

    if (result.affected === 0) {
      res.status(404).json("post not found");
    } else {
      res.json({ message: "Story deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const replace_story = async (req: Request, res: Response) => {
  try {
    const { user_id, post_id, post_image_url, caption } =
      req.body;

    const userId = parseInt(user_id);
    const postId = parseInt(post_id);

    const postToReplace = await postRepository.findOne({
      where: { user: { userId }, postId: postId },
    });

    if (!postToReplace) {
      return res.status(404).json("Story not found");
    }

    postToReplace.postImageUrl = post_image_url;
    postToReplace.caption = caption;
    postToReplace.storyOrPost = 'S';

    await postRepository.save(postToReplace);

    res.json({ message: "Story replaced successfully", post: postToReplace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

storyRouter.post("/", add_story);
storyRouter.get("/:user_id/story", get_story);
storyRouter.get("/:user_id/story/:post_id", get_story_by_id);
storyRouter.delete("/:user_id/story", delete_story);
storyRouter.delete("/:user_id/story/:post_id", delete_story_by_id);
storyRouter.put("/", replace_story);

export { storyRouter };
