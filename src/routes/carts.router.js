import { Router }     from "express";
import CartController from "../controllers/carts.controller.js";
// import ensureUserHasCart from "../middleware/userCart.middleware.js";
// import passportCall from "../middleware/passportCall.js";

const cartsRouter = Router();
const cartController = new CartController()

// cartsRouter.use(passportCall('jwt'))

cartsRouter.get   ('/',                   cartController.getCarts)
cartsRouter.post  ('/',                   cartController.createCart)
cartsRouter.get   ('/:cid',               cartController.getCart)
cartsRouter.put   ('/:cid',               cartController.updateCart)
cartsRouter.delete('/:cid',               cartController.deleteCart)
cartsRouter.post  ('/:cid/purchase',      cartController.purchaseProducts)
cartsRouter.post  ('/:cid/product/:pid',  cartController.createProductInCart)
cartsRouter.put   ('/:cid/products/:pid', cartController.updateProductInCart)
cartsRouter.delete('/:cid/products/:pid', cartController.deleteProductInCart)

export default cartsRouter