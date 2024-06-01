import { cartService } from "../services/index.js"
import { logger } from "../utils/logger.js"
import mongoose from "mongoose";

const ensureUserHasCart = async (req, res, next) => {
    try {
        // if (!req.user) {
        //     logger.warning('Usuario no encontrado en req.user')
        //     return res.status(401).json({ status: 'error', error: 'Usuario no autenticado' })
        // }

        const userId = mongoose.Types.ObjectId(req.user.id)
        logger.info(`UserId obtenido de req.user: ${userId}`)

        let cart = await cartService.getCart(userId).populate('products.product')

        if (!cart) {
            cart = await cartService.createCart({ userId, products: [] })
        }

        req.cart = cart
        next()
    } catch (error) {
        logger.error(`Error en ensureUserHasCart: ${error}`)
        res.status(500).json({ message: "Error al asociar un usuario al carrito", error });
    }

}

export default ensureUserHasCart
