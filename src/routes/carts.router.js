import { Router } from "express";
import CartController from "../controllers/carts.controller.js";
// import ensureUserHasCart from "../middleware/userCart.middleware.js";
// import passportCall from "../middleware/passportCall.js";

const cartsRouter = Router();
const cartController = new CartController()

// cartsRouter.use(passportCall('jwt'))

cartsRouter.get   ('/',                   cartController.getCarts)
cartsRouter.get   ('/:cid',               cartController.getCart)
cartsRouter.post  ('/',                   cartController.createCart)
// cartsRouter.post  ('/:cid/product/:pid',  ensureUserHasCart, cartController.createProductInCart)
cartsRouter.post  ('/:cid/product/:pid',  cartController.createProductInCart)
cartsRouter.put   ('/:cid',               cartController.updateCart)
cartsRouter.put   ('/:cid/products/:pid', cartController.updateProductInCart)
cartsRouter.delete('/:cid',               cartController.deleteCart)
cartsRouter.delete('/:cid/products/:pid', cartController.deleteProductInCart)
cartsRouter.post  ('/:cid/purchase',      cartController.purchaseProducts)

export default cartsRouter