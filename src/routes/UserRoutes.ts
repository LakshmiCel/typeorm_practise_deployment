import express, { Request, Response } from "express";
import { User } from "../entity/Users";
import { AppDataSource } from "../data-source";

const userRouter = express.Router();

const getAllUsers = async (req:Request, res:Response) => {
  try {
    const users = await AppDataSource.manager.getRepository(User).find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addUsers = async (req:Request, res:Response) => {
  try {
    const userRepository = AppDataSource.manager.getRepository(User);
    const newUser = userRepository.create(req.body);
    await userRepository.save(newUser);
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById=async (req:Request, res:Response) => {
  try {
    const userRepository = AppDataSource.manager.getRepository(User);
    const userId = parseInt(req.params.id);
    const user = await userRepository.findOne({ where: { userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const deleteSpecificUser=async (req:Request, res:Response) => {
  try {
    const userRepository = AppDataSource.manager.getRepository(User);
    const result = await userRepository.delete(req.params.user_id);
    if (result.affected === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const deleteAllUsers=async (req:Request, res:Response) => {
  try {
    const userRepository = AppDataSource.manager.getRepository(User);
    await userRepository.clear();
    res.json({ message: "All users deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
userRouter.get("/", getAllUsers);
userRouter.post("/", addUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/",deleteAllUsers );
userRouter.delete("/:user_id", deleteSpecificUser);

export default userRouter;
