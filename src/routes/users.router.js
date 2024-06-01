import { Router } from "express";
import UserController from "../controllers/users.controller.js";

const usersRouter    = Router()
const userController = new UserController()

usersRouter.get   ('/',          userController.getUsers)
usersRouter.get   ('/:username', userController.getUser)
usersRouter.post  ('/',          userController.createUser)
usersRouter.put   ('/:uid',      userController.updateUser)
usersRouter.delete('/:username', userController.deleteUser)
usersRouter.post  ('/verify',    userController.verifyUser)

export default usersRouter