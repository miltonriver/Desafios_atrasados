import express from "express";
import appRouter from "./routes/index.js";
import handlebars from "express-handlebars";
import __dirname, { uploader } from "./utils.js";
import { Server } from "socket.io";
import productsModel from "./daos/Mongo/models/products.model.js";
import passport from "passport";
import initializePassportJWT from "./config/passport.configJWT.js";
import dotenv from "dotenv";
import handlerError from "./middleware/errors/index.js";
import addLogger, { logger } from "./utils/logger.js";
import { configObject } from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import messagesModel from "./daos/Mongo/models/messages.model.js";
import usersModel from "./daos/Mongo/models/users.model.js";
import ProductDaoMongo from "./daos/Mongo/productsDaoMongo.js";

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
const productDao = new ProductDaoMongo()

io.on('connection', socket => {
    logger.info("El cliente está conectado")

    socket.on("addProduct", async (productData) => {
        try {
            logger.debug(`Contenido del producto a agregar: ${JSON.stringify(productData, null, 2)}`)

            for (let key in productData) {
                if (typeof productData[key] === 'string') {
                    productData[key] = productData[key].trim()
                }
                if (productData[key] === '') {
                    delete productData[key]
                }
            }

            if (productData.price) {
                productData.price = parseFloat(productData.price)
            }
            if (productData.stock) {
                productData.stock = parseInt(productData.stock, 10)
            }

            if (!productData.title) {
                logger.warning(`El título del producto es obligatorio`)
                socket.emit('error', 'Falta el título del producto, por favor coloque un nombre que no exista en la base de datos.')
                return
            }
            if (!productData.price || isNaN(productData.price) || productData.price <= 0) {
                logger.warning(`El precio del artículo es obligatorio y tiene que ser mayor que 0`)
                socket.emit('error', 'Debe colocar un valor numérico positivo en el campo precio.')
                return
            }
            if (!productData.stock || isNaN(productData.stock) || productData.stock <= 0) {
                logger.warning(`El producto a agregar debe ser un valor numérico entero mayor que 0`)
                socket.emit('error', 'El stock del producto está vacío o no es un valor numérico permitido.')
                return
            }

            const newProduct = await productsModel.create(productData)
            const productList = await productsModel.find()
            logger.debug(`Producto creado: ${newProduct}`)
            io.emit('productsList', productList)
        } catch (error) {
            let errorMessage;
            if (error.code === 11000) {
                errorMessage = 'El título o código del producto ya existe. Por favor, elija otro.'
            } else {
                errorMessage = 'Se ha producido un error al agregar el producto. Por favor, inténtelo nuevamente.'
            }
            logger.error(`Error al crear el producto: ${error.message}`)
            socket.emit('error', errorMessage)
        }
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