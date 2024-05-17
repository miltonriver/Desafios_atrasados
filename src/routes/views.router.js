import { Router } from "express";
import { ViewUserController, ViewProductController } from "../controllers/views.router.controller.js";

const router = Router()
const viewUserController = new ViewUserController()
const viewProductController = new ViewProductController()

router.get('/',                      viewUserController.index)

router.get('/register',              viewUserController.register)
router.get('/registerpassport',      viewUserController.registerPassport)

router.get('/login',                 viewUserController.login)
router.get('/loginpassport',         viewUserController.loginPassport)

router.get('/chatbox',               viewUserController.chatbox)

router.get('/users',                 viewUserController.usersList)

router.get('/realtimeproducts',      viewProductController.realTimeProducts)

router.get('/productosactualizados', viewProductController.productosActualizados)

router.get('/products',              viewProductController.products)

router.post('/',                     viewProductController.getProducts)

export default router