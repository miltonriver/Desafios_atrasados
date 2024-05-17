import { Router } from "express";
import SessionController from "../controllers/sessions.controller.js";
import passport from "passport";
import { authTokenMiddleware } from "../utils/jsonwebtoken.js";

// import auth from "../middleware/authentication.middleware.js";
// import UserManagerMongo from "../manager/Mongo/userManagerMongo.js";
// import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
// import generateToken from "../utils/jsonwebtoken.js";

const sessionsRouter = Router()
const sessionController = new SessionController()

sessionsRouter.post('/register', sessionController.registerUser)
sessionsRouter.post('/login', sessionController.loginUser)
sessionsRouter.get('/failregister', sessionController.failRegister)
sessionsRouter.get('/logout', sessionController.logoutUser)
sessionsRouter.get('/faillogin', sessionController.failLogin)
sessionsRouter.get('/github', passport.authenticate('github', {scope:['user:login']}), sessionController.githubLogin)
sessionsRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/api/sessions/loginpassport'}), sessionController.githubCallback)
sessionsRouter.get('/current', authTokenMiddleware, sessionController.tokenMiddleware)
sessionsRouter.post('/registerpassport', passport.authenticate('registerpassport', { failureRedirect: '/api/sessions/failregister' }), sessionController.registerPassport)
sessionsRouter.post('/loginpassport', passport.authenticate('loginpassport', { failureRedirect: '/api/sessions/faillogin' }), sessionController.loginPassport)
sessionsRouter.get('/restartPassword', sessionController.restartPassword)

export default sessionsRouter