import cluster from "cluster";
import { cpus } from "os";
import { logger } from "./logger.js";

const numeroDeProcesadores = cpus().length

logger.info(process.pid)
logger.info(cluster.isPrimary)
logger.info(numeroDeProcesadores)

if(cluster.isPrimary) {
    logger.info("Proceso primario, generando trabajadores")
    for (let i = 0; i < numeroDeProcesadores; i++) {
        cluster.fork()
    }
    cluster.on("message", worker => {
        logger.info(`Mensaje recibido de el worker ${worker.process.pid}`)
    })
} else {
    logger.info("Al ser un fork, no cuenta como proceso primario, isPrimary = false. Se creo un nuevo trabajador o worker")
    logger.info(`Soy un proceso worker con el id ${process.pid}`)
}

