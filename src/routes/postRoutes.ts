import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Post } from "../entity/Posts";

const postRouter = express.Router();
const postRepository = AppDataSource.manager.getRepository(Post);

const add_posts = async (req: Request, res: Response) => {
  try {
    const { user_id, post_image_url, caption } = req.body;

    const newPost = new Post();
    newPost.user = user_id;
    newPost.postImageUrl = post_image_url;
    newPost.caption = caption;
    newPost.storyOrPost = 'P';

    await postRepository.save(newPost);

    res.status(201).json({ message: "Post added successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const get_posts = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const userId = parseInt(user_id);

    const posts = await postRepository.find({
      where: { user: { userId }, storyOrPost: "P" },
      relations: ["user"],
    });

    if (posts.length === 0) {
      res.json("no posts found");
    } else {
      res.json(posts);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const get_posts_by_id = async (req: Request, res: Response) => {
  try {
    const { user_id, post_id } = req.params;

    const userId = parseInt(user_id);
    const postId = parseInt(post_id);

    const post = await postRepository.findOne({
      where: { user: { userId }, postId: postId, storyOrPost: "P" },
      relations: ["user"],
    });

    if (!post) {
      res.status(404).json("post not found");
    } else {
      res.json(post);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const delete_posts = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;

    const userId = parseInt(user_id);

    await postRepository.delete({ user: { userId } });

    res.json({ message: "Posts deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const delete_posts_by_id = async (req: Request, res: Response) => {
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
      res.json({ message: "Post deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const replace_posts = async (req: Request, res: Response) => {
  try {
    const { user_id, post_id, post_image_url, caption } =
      req.body;

    const userId = parseInt(user_id);
    const postId = parseInt(post_id);

    const postToReplace = await postRepository.findOne({
      where: { user: { userId }, postId: postId },
    });

    if (!postToReplace) {
      return res.status(404).json("post not found");
    }

    postToReplace.postImageUrl = post_image_url;
    postToReplace.caption = caption;
    postToReplace.storyOrPost = 'P';

    await postRepository.save(postToReplace);

    res.json({ message: "Post replaced successfully", post: postToReplace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

postRouter.post("/", add_posts);
postRouter.get("/:user_id/posts", get_posts);
postRouter.get("/:user_id/posts/:post_id", get_posts_by_id);
postRouter.delete("/:user_id/posts", delete_posts);
postRouter.delete("/:user_id/posts/:post_id", delete_posts_by_id);
postRouter.put("/", replace_posts);

export { postRouter };
