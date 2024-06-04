import passport from "passport";
import passportJwt from "passport-jwt";
import { configObject } from "./connectDB.js";
import { logger } from "../utils/logger.js";

const JWTStrategy = passportJwt.Strategy
const ExtractJWT = passportJwt.ExtractJwt

const initializePassportJWT = () => {

    const cookieExtractor = req => {
        let token = null
        if(req && req.cookies){
            token = req.cookies['cookieToken']
        }
        return token
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: configObject.jwt_private_Key
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}

export default initializePassportJWT