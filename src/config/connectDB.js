// import { connect } from "mongoose";
import MongoSingleton from "./singleton.js";
import dotenv from "dotenv";
import program from "../utils/commander.js";
import { logger } from "../utils/logger.js";

const { mode } = program.opts()

// dotenv.config({ path: './.env.development' })

dotenv.config({
    path: mode === "development" ? "./.env.development" : "./.env.production"
})

export const configObject = {
    port:            process.env.PORT || 8000,
    mongo_url:       process.env.MONGO_URL,
    jwt_private_Key: process.env.JWT_PRIVATE_KEY,
    persistence:     process.env.PERSISTENCE,
    gmail_user:      process.env.GMAIL_USER_APP,
    gmail_password:  process.env.GMAIL_PASS_APP,
    twilio_sid:      process.env.TWILIO_ACCOUNT_SID,
    twilio_token:    process.env.TWILIO_AUTH_TOKEN,
    twilio_phone:    process.env.TWILIO_PHONE_NUMBER
}

const connectDB = async () => {
    try {
        //await connect(process.env.MONGO_URL)//Conexión remota
        //await connect("mongodb://localhost:27017/MyDataBaseMilton") --> mongodb://127.0.0.1:27017/MyDataBaseMilton--Conexión local
        await MongoSingleton.getInstance(process.env.MONGO_URL)
        logger.info(`Trabajando en el entorno de ${process.env.MODO}`)
    } catch (error) {
        logger.error(error)
    }
}
console.log("Persistence type:", configObject.persistence);


export default connectDB