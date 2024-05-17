import winston from "winston";

const customLevelsOptions = {
    levels: {
        fatal  : 0,
        error  : 1,
        warning: 2,
        info   : 3,
        http   : 4,
        debug  : 5
    },
    colors: {
        fatal  : "red",
        error  : "blue",
        warning: "yellow",
        info   : "magenta",
        http   : "green",
        debug  : "cyan"
    }
}

export let logger;
if (process.env.MODO === "PRODUCCION"){
    logger = winston.createLogger({
        levels: customLevelsOptions.levels,
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelsOptions.colors }),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: './errors.log',
                level:'error',
                format: winston.format.simple()
            })
        ]
    })
} else {
    logger = winston.createLogger({
        levels: customLevelsOptions.levels,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelsOptions.colors }),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: './errors.log',
                level:'error',
                format: winston.format.simple()
            })
        ]
    })
}

// console.log("Contenido de logger: ", logger.levels.info)

const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} ---- ${new Date().toLocaleTimeString()}`)
    next()
}

export default addLogger