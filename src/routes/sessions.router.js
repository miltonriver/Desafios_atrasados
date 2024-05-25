import { Router } from "express";
import SessionController from "../controllers/sessions.controller.js";
import passportCall from "../middleware/passportCall.js";
import authorization from "../middleware/authorization.middleware.js";
// import passport from "passport";
// import { authTokenMiddleware } from "../utils/jsonwebtoken.js";

const sessionsRouter = Router()
const sessionController = new SessionController()

sessionsRouter.post('/register', sessionController.registerUser)
sessionsRouter.post('/login', sessionController.loginUser)
sessionsRouter.get ('/failregister', sessionController.failRegister)
sessionsRouter.get ('/logout', sessionController.logoutUser)
sessionsRouter.get ('/faillogin', sessionController.failLogin)
sessionsRouter.get ('/current', passportCall('jwt'), authorization('admin'), sessionController.tokenMiddleware)//Estrategia usada con Passport-jwt--------------------
sessionsRouter.get ('/restartPassword', sessionController.restartPassword)//completar
// sessionsRouter.get ('/github', passport.authenticate('github', {scope:['user:login']}), sessionController.githubLogin)
// sessionsRouter.get ('/githubcallback', passport.authenticate('github', {failureRedirect: '/api/sessions/loginpassport'}), sessionController.githubCallback)
// sessionsRouter.get ('/current', authTokenMiddleware, sessionController.tokenMiddleware)//Estrategia utilizada con bcrypt y jwt-------------------------
// sessionsRouter.post('/registerpassport', passport.authenticate('registerpassport', { failureRedirect: '/api/sessions/failregister' }), sessionController.registerPassport)
// sessionsRouter.post('/loginpassport', passport.authenticate('loginpassport', { failureRedirect: '/api/sessions/faillogin' }), sessionController.loginPassport)

export default sessionsRouter