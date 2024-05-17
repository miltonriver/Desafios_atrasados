// import CartDaoMongo from "../daos/Mongo/cartsDaoMongo.js";
// import DAOFactory from "../daos/factory.js";
import { cartService } from "../services/index.js";
import { logger } from "../utils/logger.js";

class CartController {
    constructor() {
        this.cartService = cartService
    }

    getCarts            = async (req, res) => {
        try {
            const carts = await this.cartService.getCarts()
            res.status(400).send({
                status: "success",
                message: 'Colección de carts exitosa',
                carts
            })
        } catch (error) {
            logger.error(`Ocurrió un error inesperado al intentar acceder a la colección de carts`)
            return
        }
    }

    getCart             = async (req, res) => {
        try {
            const { cid } = req.params
            const cartId = await this.cartService.getCart({ _id: cid })

            if (cartId.length !== 0) {
                res.status(200).send({
                    status: "success",
                    message: `El carrito de ID "${cartId._id}" se ha seleccionado correctamente`,
                    cartId
                })
            }
            logger.info(`El carrito de ID "${cartId._id}" ha sido seleccionado correctamente`)

        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: 'El carrito solicitado no existe o está vacío'
            })
        }
    }

    createCart          = async (req, res) => {
        try {
            const { products } = req.body
            const newCart = {
                products
            }
            const result = await this.cartService.createCart(newCart)

            res.status(201).send({
                status: "success",
                message: `El carrito ID "${result._id}" ha sido agregado exitosamente`,
                result: result
            })
            logger.info(`El carrito ID "${result._id}" ha sido agregado exitosamente`)

        } catch (error) {
            res.status(500).send({
                status: 'error',
                message: 'Error al agregar el carrito',
                error: error.message
            })
        }
    }

    createProductInCart = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const cart = await this.cartService.getCart({ _id: cid })

            if (cart.products.length < 0) {
                return res.status(400).send({
                    status: 'error',
                    message: 'El carrito está vacío',
                })
            }

            const productToAdd = {
                product: pid,
                quantity: 6
            }

            cart.products.push(productToAdd)
            await cart.save()

            res.status(200).send({
                status: "succes",
                message: 'Producto agregado al carrito con éxito',
                result: cart
            })
            logger.info(`El producto de ID "${pid}" ha sido agregado al carrito con éxito`)

        } catch (error) {
            res.status(404).send({
                status: 'error',
                mesagge: 'El carrito solicitado no existe',
                result: error
            })
        }
    }

    updateCart          = async (req, res) => {
        try {
            const { cid } = req.params
            const productToAddToCart = req.body

            const cartToUpdate = await this.cartService.updateCart(cid)
            cartToUpdate.products.push(productToAddToCart)
            await cartToUpdate.save()

            res.status(200).send({
                status: 'succes',
                message: `El carrito de ID ${cartToUpdate._id} ha sido actualizado`,
                result: cartToUpdate
            })
            logger.info(`El carrito de ID "${cid}" ha sido actualizado`)

        } catch (error) {
            console.error(`Error al intentar actualizar el carrito, ${error.message}`);
            res.status(400).send({
                status: 'error',
                message: 'Error interno al intentar actualizar el carrito'
            })
        }
    }

    updateProductInCart = async (req, res) => {
        // log("Entrando a la ruta PUT '/:cid/product/:pid'");
        try {
            const { cid, pid } = req.params
            const { newQuantity } = req.body
            // log(`Valor de cid: ${cid}`)
            const cart = await this.cartService.getCart(cid)
            logger.warning(JSON.stringify(cart, null, '\t'))

            if (!cart) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El carrito solicitado no existe.',
                });
            }

            if (cart.products.length === 0) {
                return res.status(400).send({
                    status: 'error',
                    message: 'El carrito está vacío',
                })
            }
            logger.debug(cart.products[0]._id)

            const productIndex = cart.products.findIndex(
                (product) => String(product._id) === String(pid)
            )
            logger.debug(productIndex)

            if (productIndex === -1) {
                logger.error(`Producto con ID ${pid} no se encuentra en el carrito.`)
                return res.status(404).send({
                    status: 'error',
                    message: `Producto con ID ${pid} no se encuentra en el carrito.`
                })
            }

            cart.products[productIndex].quantity = newQuantity
            await cart.save()

            res.status(200).send({
                status: "succes",
                message: `Cantidad del producto con ID ${pid} actualizada con éxito.`,
                result: cart
            })
            logger.info(`Cantidad del producto con ID ${pid} actualizada con éxito. La nueva cantidad es de "${newQuantity}"`)

        } catch (error) {
            logger.error(`Error al intentar actualizar la cantidad del producto en el carrito: "${error}"`);
            return res.status(404).send({
                status: 'error',
                mesagge: 'Error interno al intentar actualizar la cantidad del producto en el carrito.',
                result: error.message
            })
        }
    }

    deleteCart          = async (req, res) => {
        try {
            const { cid } = req.params
            const deleteCart = await this.cartService.deleteCart(cid)

            if (!deleteCart) {
                logger.info(`El carrito cuyo ID es "${cid}" no existe`)
                return res.status(400).send({
                    status: 'Error',
                    message: `El carrito cuyo ID es "${cid}" no existe`,
                    deleteProduct
                })
            }

            res.status(200).send({
                status: 'success',
                message: `El carrito de ID "${cid}" ha sido eliminado`
            })
            logger.info(`El carrito de ID "${cid}" ha sido eliminado`)
        } catch (error) {
            logger.error('Error al intentar eliminar el carrito:', error.message);
            res.status(500).send({
                status: error,
                message: 'Error interno al intentar eliminar el carrito'
            });
        }
    }

    deleteProductInCart = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const cart = await this.cartService.getCart(cid)
            // logger.debug(`Contenido de cart: ${cart}`)

            if (!cart) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El carrito solicitado no existe.',
                });
            }

            if (cart.products.length < 0) {
                return res.status(400).send({
                    status: 'error',
                    message: 'El carrito está vacío, no se puede eliminar',
                })
            }

            const productIndex = cart.products.findIndex(
                (product) => String(product._id) === String(pid)
            );
            // logger.debug(`Contenido del índice: ${productIndex}`)

            cart.products.splice(productIndex, 1);

            await cart.save();

            res.status(200).send({
                status: "success",
                message: `El producto con ID ${pid} ha sido eliminado del carrito con ID ${cid}.`,
                result: cart
            })
            logger.info(`El producto con ID ${pid} ha sido eliminado del carrito con ID ${cid}.`)
        } catch (error) {
            res.status(404).send({
                status: 'error',
                mesagge: 'Error interno al intentar eliminar el producto del carrito',
                result: error
            })
        }
    }
}

export default CartController