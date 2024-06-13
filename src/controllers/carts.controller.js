import { cartService,
        productService,
        ticketService } from "../services/index.js";
import { logger }       from "../utils/logger.js";
import { nanoid }       from "nanoid";

class CartController {
    constructor() {
        this.cartService = cartService
    }

    getCarts = async (req, res) => {
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

    getCart = async (req, res) => {
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
            res.status(500).send({
                status: 'error',
                message: 'El carrito solicitado no existe o está vacío'
            })
        }
    }

    createCart = async (req, res) => {
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
            const { quantity } = req.body
            const cart = await this.cartService.getCart({ _id: cid })
            logger.debug(`carrito obtenido: ${JSON.stringify(cart, null, 2)}`)
            const product = await productService.getProduct({ _id: pid })
            const newProductStock = product.stock - quantity

            if (cart.products.length < 0) {
                return res.status(400).send({
                    status: 'error',
                    message: 'El carrito está vacío',
                })
            }

            const pidString = pid.toString()

            const productIndexInCart = cart.products.findIndex(item => item.product._id.toString() === pidString)

            if (productIndexInCart > -1) {
                const newQuantity = parseInt(cart.products[productIndexInCart].quantity) + parseInt(quantity)
                cart.products[productIndexInCart].quantity = newQuantity
            } else {
                const productToAdd = {
                    product: pid,
                    quantity: quantity
                }
                cart.products.push(productToAdd)
            }

            product.stock = newProductStock
            await product.save()
            await cart.save()

            res.status(200).send({
                status: "success",
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

    updateCart = async (req, res) => {
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

    deleteCart = async (req, res) => {
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
            const { quantity } = req.body
            const cart = await this.cartService.getCart(cid)

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
                (p) => String(p.product._id) === String(pid)
            );

            logger.debug(`indice del producto: ${productIndex}`)
            
            cart.products.splice(productIndex, 1)
            await cart.save();

            const product = await productService.getProduct(pid)
            product.stock += parseInt(quantity)
            await product.save()
            
            res.status(200).send({
                status: "success",
                message: `El producto con ID ${pid} ha sido eliminado del carrito con ID ${cid}.`,
                result: cart
            })
            logger.info(`El producto ${product.title} ha sido eliminado del carrito con ID ${cid}.`)
        } catch (error) {
            res.status(404).send({
                status: 'error',
                mesagge: 'Error interno al intentar eliminar el producto del carrito',
                result: error
            })
        }
    }

    purchaseProducts = async (req, res) => {
        try {
            const { cid } = req.params
            let cart = await this.cartService.getCart(cid)

            if (!cart) {
                return res.status(404).send({ status: 'error', message: 'No se puede encontrar el carrito seleccionado' })
            }

            const purchaseProducts = []
            let totalCartPrice = 0

            for (let i = 0; i < cart.products.length; i++) {
                const totalBuy = cart.products[i].product.price * cart.products[i].quantity
                purchaseProducts.push(totalBuy)
                logger.info(`Total obtenido durante la iteración nro ${i}: $ ${totalBuy}`)
                totalCartPrice += totalBuy
            }
            logger.debug(`Precio total de la compra: $ ${totalCartPrice}`)

            if (purchaseProducts.length > 0) {
                const ticket = await ticketService.createTicket({
                    code: nanoid(),
                    purchase_datetime: new Date(),
                    amount: totalCartPrice,
                    purchaser: cart.userEmail
                })
                logger.info(`Compra realizada exitosamente, se ha generado el siguiente ticket: ${ticket}`)

                const newCart = { _id: cid, userEmail: ticket.purchaser, products: []}
                cart = await this.cartService.updateCart(cid, newCart)
                cart.save()

                return res.status(200).send({
                    status: 'success',
                    message: 'Compra completada exitosamente',
                    ticket
                })
            } else {
                return res.status(400).send({
                    status: 'error',
                    message: 'El stock del producto a comprar es insuficiente',
                })
            }
        } catch (error) {
            logger.error('Error al procesar la compra: ', error);
            return res.status(500).send({
                status: 'error',
                message: 'Error en el proceso de compra',
                error: error.message
            })
        }
    }
}

export default CartController