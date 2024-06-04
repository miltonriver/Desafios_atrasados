// import logger               from "morgan";
// import viewsRouter          from "./routes/views.router.js"
import express                 from "express";
import appRouter               from "./routes/index.js";
import handlebars              from "express-handlebars";
import __dirname, { uploader } from "./utils.js";
import { Server }              from "socket.io";
import productsModel           from "./daos/Mongo/models/products.model.js";
import passport                from "passport";
import initializePassportJWT   from "./config/passport.configJWT.js";
import dotenv                  from "dotenv";
import handlerError            from "./middleware/errors/index.js";
import addLogger, { logger }   from "./utils/logger.js";
import { configObject }        from "./config/connectDB.js";
import cookieParser            from "cookie-parser";
import messagesModel           from "./daos/Mongo/models/messages.model.js";
import usersModel              from "./daos/Mongo/models/users.model.js";

dotenv.config()

const app = express()
const PORT = configObject.port

const hbs = handlebars.create({
    helpers: {
        increment: function (value) {
            return value + 1;
        }
    },
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
})

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(cookieParser())

initializePassportJWT();
app.use(passport.initialize());

app.use(addLogger)

app.use((req, res, next) => {
    req.logger.info("Datos del cuerpo:", req.body);
    next();
});

app.engine('handlebars', hbs.engine)
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")
// app.use   ('/', viewsRouter)

app.post("/file", uploader.single('myFile'), (req, res) => {
    res.send("imagen subida")
})

app.use(appRouter)
app.use(handlerError)

const httpServer = app.listen(PORT, (err) => {
    if (err) logger.error(err)
    logger.info(`Escuchando en el puerto ${PORT}`)
})

const io = new Server(httpServer)

let mensajes = []

io.on('connection', socket => {
    logger.info("El cliente está conectado")

    socket.on("addProduct", async (productData) => {
        const newProduct = await productsModel.create(productData)
        const productList = await productsModel.find()
        logger.debug(`Producto creado: ${newProduct}`)
        io.emit('productsList', productList)
    })

    socket.on("deleteProduct", async (productId) => {
        const productDeleted = await productsModel.findOneAndDelete(productId)
        logger.debug(`producto a borrar: ${productDeleted}`)

        const productList = await productsModel.find()
        io.emit('productsList', productList)
    })

    socket.on("addProductToCart", async (product) => {
        io.emit("updatedCart", product)
    })

    socket.on('message', async (data) => {
        const { username, message } = await data
        const user = await usersModel.findOne({ username })

        if (!user || (user.role !== 'user' && user.role !== 'user_premium')) {
            logger.warning(`Usuario no autorizado o no encontrado: ${username}`);
            return;
        }

        mensajes.push(data)
        io.emit('messageLogs', mensajes)

        const updatedMessages = await messagesModel.findOne({ user: username })

        if (!updatedMessages) {
            const newUserMessages = await messagesModel.create({ user: username, message })
            logger.info("Nuevo usuario creado:", newUserMessages.user)
            return
        }
        let newMessage;
        try {
            newMessage = JSON.parse(updatedMessages.message);
        } catch (error) {
            newMessage = updatedMessages.message;
        }

        updatedMessages.message = message + "\n" + newMessage

        const result = await updatedMessages.save()
    })
})