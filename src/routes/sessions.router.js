import { Router }        from "express";
import SessionController from "../controllers/sessions.controller.js";
import passportCall      from "../middleware/passportCall.js";
import authorization     from "../middleware/authorization.middleware.js";

const sessionsRouter = Router()
const sessionController = new SessionController()

sessionsRouter.post('/register',             sessionController.registerUser)
sessionsRouter.post('/login',                sessionController.loginUser)
sessionsRouter.get ('/failregister',         sessionController.failRegister)
sessionsRouter.get ('/logout',               sessionController.logoutUser)
sessionsRouter.get ('/faillogin',            sessionController.failLogin)
sessionsRouter.get ('/current',              passportCall('jwt'), authorization('admin'), sessionController.tokenMiddleware)//Estrategia usada con Passport-jwt--------------------
sessionsRouter.get ('/restartpassword',      sessionController.restartPassword)
sessionsRouter.get ('/resetpassword/:token', sessionController.resetPassword)
sessionsRouter.post('/resetpassword',        sessionController.newPassword)
sessionsRouter.post('/mail',                 sessionController.emailRestart)

export default sessionsRouter