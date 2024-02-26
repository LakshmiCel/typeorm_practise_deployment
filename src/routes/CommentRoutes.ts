import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Comment } from "../entity/Comments";
// import { IsNull } from "typeorm";

const commentRouter = express.Router();
const commentRepository = AppDataSource.manager.getRepository(Comment);

const getAllComments = async (req: Request, res: Response) => {
  try {
    const { post_id } = req.params;
    const postId = parseInt(post_id);
    const comments = await commentRepository.find({
      where: { post: { postId: postId } },
      relations: ["user", "replies", "replies.user"],
    });

    const filteredComments = comments.filter(
      (comment) => comment.replies.length === 0
    );

    res.json({
      comments: filteredComments,
      commentCount: filteredComments.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReplies = async (req: Request, res: Response) => {
  try {
    const { comment_id } = req.params;
    const commentId = parseInt(comment_id);
    const comment = await commentRepository.find({
      where: { commentId: commentId },
      relations: ["user","replies", "replies.user"],
    });
    const filteredReplies = comment.filter(
      (comment) => comment.replies.length > 0
    );
    console.log(filteredReplies, comment);

    if (filteredReplies.length === 0) {
      return res.status(404).json({ error: "Reply not found" });
    }

    res.json(filteredReplies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addCommentOrReply = async (req: Request, res: Response) => {
  try {
    const { post_id, user_id, comment_text, reply_id } = req.body;
    const newComment = new Comment();
    newComment.user = user_id;
    newComment.post = post_id;
    newComment.commentText = comment_text;
    newComment.commentTimestamp = new Date();
    let message: string = "Comment added successfully";
  
    if (reply_id) {
      const parentComment = await commentRepository.findOne({
        where: { commentId: reply_id },
      });
      if (!parentComment) {
        return res.status(404).json({ error: "Parent comment not found" });
      }
      newComment.parentComment = parentComment;
      message = "Reply added successfully";
    }

    await commentRepository.save(newComment);
    res.status(201).json({ message: message, comment: newComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const updateCommentOrReply = async (req: Request, res: Response) => {
  try {
    const { comment_id, user_id, post_id } = req.params; // Extract user_id and post_id from params
    const { comment_text } = req.body;

   
    const commentToUpdate = await commentRepository.findOne({
      where: {
        commentId: parseInt(comment_id),
        user: { userId: parseInt(user_id) },
        post: { postId: parseInt(post_id) },
      },
    });

    if (!commentToUpdate) {
      return res.status(404).json({ error: "Comment or reply not found" });
    }

    commentToUpdate.commentText = comment_text;
    await commentRepository.save(commentToUpdate);

    res.json({
      message: "Comment or reply updated successfully",
      comment: commentToUpdate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCommentOrReply = async (req: Request, res: Response) => {
  try {
    const { comment_id, user_id, post_id } = req.params; // Extract user_id and post_id from params

    const commentToDelete = await commentRepository.findOne({
      where: {
        commentId: parseInt(comment_id),
        user: { userId: parseInt(user_id) },
        post: { postId: parseInt(post_id) },
      },
    });

    if (!commentToDelete) {
      return res.status(404).json({ error: "Comment or reply not found" });
    }

    await commentRepository.remove(commentToDelete);

    res.json({ message: "Comment or reply deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

commentRouter.get("/posts/:post_id", getAllComments);
commentRouter.get("/replies/:comment_id", getAllReplies);
commentRouter.post("/", addCommentOrReply);
commentRouter.put("/:comment_id", updateCommentOrReply);
commentRouter.delete("/:comment_id", deleteCommentOrReply);

export { commentRouter };
