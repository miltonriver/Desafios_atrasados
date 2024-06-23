import { Router }        from "express";
import ProductController from "../controllers/products.controller.js";

const productsRouter = Router();
const productController = new ProductController()

productsRouter.get   ('/',     productController.getProducts)
productsRouter.post  ('/',     productController.createProduct)
productsRouter.get   ('/:pid', productController.getProduct)
productsRouter.put   ('/:pid', productController.updateProduct)
productsRouter.delete('/:pid', productController.deleteProduct)

export default productsRouter