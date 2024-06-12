import jwt              from "jsonwebtoken";
import { configObject } from "../config/connectDB.js";
import { logger } from "./logger.js";

const private_key = configObject.jwt_private_Key
const generateToken = (user) => jwt.sign(user, private_key, {expiresIn: "24h"})

export const authTokenMiddleware = (req, res, next) => {
    const authHeader = req.cookies['cookieToken']

    if(!authHeader) return res.status(401).send({status: "error", message: "token invalid"})

    jwt.verify(authHeader, private_key, (error, decodeUser) => {
        if(error) return res.status(401).send({status: "error", message: "no authorizated"})

        req.user = decodeUser
        next()
    })
}

export default generateToken