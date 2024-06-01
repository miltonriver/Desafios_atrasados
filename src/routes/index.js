import { Router }     from "express";
import usersRouter    from "./users.router.js";
import productsRouter from "./products.router.js";
import cartsRouter    from "./carts.router.js";
import messagesRouter from "./messages.router.js";
import pruebasRouter  from "./pruebas.router.js";
import sessionsRouter from "./sessions.router.js";
import ticketsRouter  from "./tickets.router.js";
import viewsRouter    from "./views.router.js";


const router = Router()

router.use('/',             viewsRouter)
router.use('/api/users',    usersRouter)
router.use('/api/carts',    cartsRouter)
router.use('/api/tickets',  ticketsRouter)
router.use('/api/products', productsRouter)
router.use('/api/sessions', sessionsRouter)
router.use('/api/messages', messagesRouter)
router.use('/pruebas',      pruebasRouter)
router.get('*', async (req, res) => {
    res.status(404).send('La ruta especificada no existe')
})

export default router