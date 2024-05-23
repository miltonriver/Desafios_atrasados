import passport from "passport";
import local from "passport-local";
import UserDaoMongo from "../daos/Mongo/userDaoMongo.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import GithubStrategy from "passport-github2";
import { logger } from "../utils/logger.js";
import { configObject } from "./connectDB.js";

const LocalStrategy = local.Strategy
const userModel = new UserDaoMongo()

const initializePassport = () => {
    logger.debug('Inicializando Passport')

    passport.use('registerpassport', new LocalStrategy({
        passReqToCallback: true, //para acceder al objeto req
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, phone_number } = req.body
        try {
            let user = await userModel.getBy(username)

            if (user) return done(null, false)

            const newphoneNumber = phone_number && phone_number.trim() !== '' ? phone_number : 1111111111

            let newUser = {
                first_name,
                last_name,
                username,
                email,
                password: createHash(password),
                phone_number: newphoneNumber
            }
            
            let result = await userModel.create(newUser)

            return done(null, result)
        } catch (error) {
            logger.error(`Error en la creación del usuario: ${error.message}`)
            return done(error)
        }
    }))

    logger.debug('Estrategia registerpassport configurada')

    passport.use('loginpassport', new LocalStrategy({
        // usernameField: 'username'
    }, async(username, password, done) => {
        try {
            const user = await userModel.getBy(username)
            logger.debug(`Contenido de user: ${user}`)

            if(!user) {
                logger.info("usuario no encontrado")
                return done(null, false)
            }
            
            if(!isValidPassword(password, user.password)) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.username)
    })
    passport.deserializeUser(async (username, done) => {
        let user = await userModel.getBy(username)
        done(null, user)
    })

    passport.use("github", new GithubStrategy({
        clientID:     configObject.github_clientID,
        clientSecret: configObject.github_clientSecret,
        callbackURL:  configObject.github_callbackURL
    }, async (accessToken, refreshToken, profile, done) => {
        logger.info("Estrategia Github configurada correctamente")
        try {
            let user = await userModel.getBy(profile._json.login)
            if(!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: profile._json.company,
                    username: profile._json.login,
                    email: profile._json.email,
                    password: profile._json.id,
                    role: "admin"
                }

                let result = await userModel.create(newUser)
                return done(null, result)
            }

            return done(null, user)
        } catch (error) {
            done(error)            
        }
    }))
}

export default initializePassport