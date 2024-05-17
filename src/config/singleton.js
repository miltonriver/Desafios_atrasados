import { connect } from "mongoose";
import { logger } from "../utils/logger.js";

class MongoSingleton {
    static #instance
    constructor(mongo_url){
        connect(mongo_url)
    }

    static getInstance = (mongo_url) => {
        if (this.#instance) {
            logger.info("Base de datos previamente conectada")
            return this.#instance
        }

        this.#instance = new MongoSingleton(mongo_url)
        logger.info('Base de datos conectada')
        return this.#instance
    }
}

export default MongoSingleton