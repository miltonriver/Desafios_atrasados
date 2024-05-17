import EErrors from "../../services/errors/enums.js";

const handlerError = (error, req, res, next) => {
    console.error("Este es el error: ", error)
    res.status(500).json({ status: "error", message: error.message });
// }
//     if (error instanceof Error) {
//         // Error estándar
//         res.status(500).send({ status: "error", error: error.message });
//     } else if (error.code === EErrors.INVALID_TYPES_ERROR) {
//         // Error de tipos inválidos
//         res.status(400).send({ status: "error", error: error.message });
//     } else {
//         // Otro tipo de error no manejado
//         res.status(500).send({ status: "error", error: "Unhandled error" });
//     }
// }
    switch (error) {
        case EErrors.ROUTING_ERROR:
            res.send({status:"error", error: error.message})
            break;

        case EErrors.INVALID_TYPES_ERROR:
            res.send({status:"error", error: error.message})
            break;

        case EErrors.DATABASE_ERROR:
            res.send({status:"error", error: error.message})
            break;

        default:
            res.send({status:"error", error:"Unhandled error"})
            break;
    }
}

export default handlerError