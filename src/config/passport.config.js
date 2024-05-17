import passport from "passport";
import local from "passport-local";
import UserDaoMongo from "../daos/Mongo/userDaoMongo.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import GithubStrategy from "passport-github2";
import { logger } from "../utils/logger.js";

const LocalStrategy = local.Strategy
const userModel = new UserDaoMongo()

const initializePassport = () => {
    passport.use('registerpassport', new LocalStrategy({
        passReqToCallback: true, //para acceder al objeto req
        // usernameField: 'username'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, phone_number } = req.body
        try {
            let user = await userModel.getBy(username)

            if (user) return done(null, false)

            let newUser = {
                first_name,
                last_name,
                username,
                email,
                password: createHash(password),
                phone_number
            }

            let result = await userModel.create(newUser)

            return done(null, result)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('loginpassport', new LocalStrategy({
        // usernameField: 'username'
    }, async(username, password, done) => {
        try {
            const user = await userModel.getBy(username)
            if(!user) {
                logger.info("usuario no encontrado")
                return done(null, false)
            }

            /* if (user.username === "coderhouse") {
                user.role = "admin",
                    res.render('adminPage', {
                        username: username,
                        style: 'index.css'
                    })
            } */
            
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
        clientID: "Iv1.c2c12058150226c2",
        clientSecret: "12635beb449619a17e5b8a3d75707273a4c13933",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
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