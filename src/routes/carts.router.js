import { Router } from "express";
import CartController from "../controllers/carts.controller.js";

const cartsRouter = Router();
const cartController = new CartController()

cartsRouter.get   ('/', cartController.getCarts)
cartsRouter.get   ('/:cid', cartController.getCart)
cartsRouter.post  ('/', cartController.createCart)
cartsRouter.post  ('/:cid/product/:pid', cartController.createProductInCart)
cartsRouter.put   ('/:cid', cartController.updateCart)
cartsRouter.put   ('/:cid/products/:pid', cartController.updateProductInCart)
cartsRouter.delete('/:cid', cartController.deleteCart)
cartsRouter.delete('/:cid/products/:pid', cartController.deleteProductInCart)

export default cartsRouter