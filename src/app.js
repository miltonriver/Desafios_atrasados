import express from "express";
// import logger from "morgan";
import appRouter from "./routes/index.js";
import handlebars from "express-handlebars";
import __dirname, { uploader } from "./utils.js";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js"
import productsModel from "./daos/Mongo/models/products.model.js";
import messagesModel from "./daos/Mongo/models/messages.model.js";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import dotenv from "dotenv";
import handlerError from "./middleware/errors/index.js";
import addLogger, { logger }  from "./utils/logger.js";
import { configObject } from "./config/connectDB.js";
import cookieParser from "cookie-parser";


dotenv.config()

const app = express()
const PORT = configObject.port

const hbs = handlebars.create({
    helpers: {
        increment:function (value) {
            return value + 1;
        }
    }
})

app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({ extends: true}));
app.use(cookieParser())
// app.use(logger('dev'));
app.use(session({//Se deja de usar al usar jsonwebtoken
    store: MongoStore.create({
        mongoUrl: configObject.mongo_url,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 30
    }),
    secret: "secretMilton",
    resave: false,
    saveUninitialized: false
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());//Debo retirarlo al usar jsonwebtoken

app.use(addLogger)

app.use((req, res, next) => {
    req.logger.info("Datos del cuerpo:", req.body);
    next();
});


app.engine('handlebars', hbs.engine)
app.set("views", __dirname+ "/views")
app.set("view engine", "handlebars")
app.use('/', viewsRouter)

app.post("/file", uploader.single('myFile'), (req, res)=> {
    res.send("imagen subida")
})

app.use(appRouter)
app.use(handlerError)

const httpServer = app.listen(PORT, (err) => {
    if(err) logger.error(err)
    logger.info(`Escuchando en el puerto ${PORT}`)
})

const io = new Server(httpServer)

let mensajes = []

io.on('connection', socket => {
    logger.info("El cliente está conectado")

    socket.on("addProduct",  async (productData) => {
        const newProduct = await productsModel.create(productData)
        const productList = await productsModel.find()
        io.emit('productsList', productList)
    })

    socket.on("deleteProduct", async (productId) => {
        const productDeleted = await productsModel.findOneAndDelete(productId)
        
        const productList = await productsModel.find()
        io.emit('productsList', productList)
    })

    socket.on("addProductToCart", async (product) => {
        io.emit("updatedCart", product)
    })

    socket.on("message1", (data) => {
        logger.info(data)
    })

    socket.on('message', async (data) => {
        mensajes.push(data)
        io.emit('messageLogs', mensajes)
        const { email, message } = await data

        const updatedMessages = await messagesModel.findOne({user: email})

        if (!updatedMessages){
            const newUserMessages = await messagesModel.create({user: email, message})
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