import bcrypt from "bcrypt";
import { logger } from "./logger.js";

export const createHash =  password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (password, passwordUser) => {
    logger.debug(`contenido de password ${password} y contenido de hash ${passwordUser}`)
    return bcrypt.compareSync(password, passwordUser)
}