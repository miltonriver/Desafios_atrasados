import { Router }              from "express";
import { ViewUserController, 
         ViewProductController, 
         ViewCartController }  from "../controllers/views.router.controller.js";
import passportCall from "../middleware/passportCall.js";

const viewsRouter           = Router()
const viewUserController    = new ViewUserController()
const viewProductController = new ViewProductController()
const viewCartController    = new ViewCartController()

viewsRouter.get('/',                      viewUserController.index)
viewsRouter.post('/',                     viewProductController.getProducts)
viewsRouter.get('/cart',                  passportCall('jwt'),   viewCartController.cartView)
viewsRouter.get('/login',                 viewUserController.login)
viewsRouter.get('/users',                 viewUserController.usersList)
viewsRouter.get('/chatbox',               viewUserController.chatbox)
viewsRouter.get('/register',              viewUserController.register)
viewsRouter.get('/products',              viewProductController.products)
viewsRouter.get('/realtimeproducts',      viewProductController.realTimeProducts)
viewsRouter.get('/productosactualizados', passportCall('jwt'), viewProductController.productosActualizados)

export default viewsRouter