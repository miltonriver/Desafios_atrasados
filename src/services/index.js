import UserRepository from "./users.repository.js";
import ProductRepository from "./products.repository.js";
import CartRepository from "./carts.repository.js";
import DAOFactory from "../daos/factory.js";

export const userService    = new UserRepository(DAOFactory.getUserDao())
export const productService = new ProductRepository(DAOFactory.getProductDao())
export const cartService    = new CartRepository(DAOFactory.getCartDao())