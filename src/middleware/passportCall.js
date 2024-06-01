import passport from "passport";
import { logger } from "../utils/logger.js";

const passportCall = strategy => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if(err) {
                logger.error(`Error en passport.authenticate: ${err}`)
                return next(err)
            }
            if(!user) {
                logger.warning('Usuario no autenticado')
                return res.status(401).send({status: 'error', error: info.message ? info.message : info.toString()})
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export default passportCall