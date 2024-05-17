// import UserDaoMongo from "../daos/Mongo/userDaoMongo.js";
import DAOFactory from "../daos/factory.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import generateToken from "../utils/jsonwebtoken.js";
import productsModel from "../daos/Mongo/models/products.model.js";
import { logger } from "../utils/logger.js";

class SessionController {
    constructor() {
        this.sessionService = DAOFactory.getUserDao()
    }

    registerUser = async (req, res) => {
        try {
            const { first_name, last_name, username, email, password, phone_number } = req.body
            const fullname = `${first_name} ${last_name}`

            if (!first_name || !last_name || !username || !email || !password) {
                return res.send("Quedan campos sin llenar, por favor ingrese los campos que son obligatorios")
            }

            const newUser = {
                first_name,
                last_name,
                username,
                email,
                password: createHash(password),
                phone_number
            }
            const result = await this.sessionService.create(newUser)

            const token = generateToken({
                fullname: fullname,
                username: username,
                // id: result._id
            })

            logger.info('token: ', token)

            /* res.status(200).send({
                username: username,
                status: "success",
                usersCreate: result,
                token
            }) */

            res.render('registerSuccess', {
                username: username,
                fullname: fullname,
                usersCreate: result,
                style: "index.css"
            })

        } catch (error) {
            res.send({
                status: "error",
                error: error.message
            })
        }
    }

    loginUser = async (req, res) => {
        try {
            const { username, password } = req.body
            const user = await this.sessionService.getBy(username)

            if (user.email === "adminCoder@coder.com") {
                user.role = "admin",
                    res.render('adminPage', {
                        username: username,
                        style: 'index.css'
                    })
            }

            if (!user) {
                return res.send({
                    status: "error",
                    error: "El usuario no existe o no está registrado"
                })
            }

            if (!isValidPassword(password, user.password)) return res.status(401).send('no coinciden las credenciales')

            const token = generateToken({
                fullname: `${user.first_name} ${user.last_name}`,
                username: username,
                id: user._id
            })
            logger.info("token: ", token)

            const products = await productsModel.find({})
            res.render('productosActualizados', {//hacer un redirect a views.router
                username: username,
                productos: products,
                style: 'index.css'
            })

        } catch (error) {
            logger.error(error)
            res.send({
                status: "error",
                error: error.message,
            })
        }
    }

    failRegister = async (req, res) => {
        try {
            res.send({ error: 'falla en el registro' })

        } catch (error) {
            res.send({
                status: "error",
                error: error.message
            })
        }
    }

    logoutUser = (req, res) => {
        
        try {
            req.session.destroy(error => {
                if (error) return res.send('Logout error')
                res.send({
                    status: 'success',
                    message: 'logout ok'
                })
            })
        } catch (error) {
            res.send({
                status: "error",
                error: error.message
            })
        }
    }

    failLogin = async (req, res) => {
        try {
            logger.warning("Failed Strategy")
            res.send({ error: 'falla al intentar loguearse' })

        } catch (error) {
            res.send({
                status: "error",
                error: error.message
            })
        }
    }

    githubLogin = async (req, res) => { }

    githubCallback = async (req, res) => {
        try {
            req.session.user = req.user
            res.redirect('/realtimeproducts')

        } catch (error) {
            res.send({
                status: "error",
                error: error.message
            })
        }
    }

    tokenMiddleware = async (req, res) => {
        try {
            res.send('<h1>Datos sensibles</h1>')
        } catch (error) {
            res.send({
                status: "error",
                error: error.message
            })
        }
    }

    registerPassport = async (req, res) => {
        try {
            const username = req.body.username || (req.user && req.user.username);

            res.render('registerSuccessPassport', {
                username: username,
                style: "index.css"
            })

        } catch (error) {
            res.send({
                status: "error",
                error: error.message
            })
        }
    }

    loginPassport = async (req, res) => {
        try {
            if (!req.user) return res.status(401).send({ status: "error", error: "credenciales inválidas" })

            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                phone_number: req.user.phone_number
            }

            const username = req.body.username || (req.user && req.user.username);
            const products = await productsModel.find({})
            res.render('productosActualizados', {
                username: username,
                productos: products,
                style: 'index.css'
            })

        } catch (error) {
            res.send({
                status: "error",
                error: error.message
            })
        }
    }

    restartPassword = async (req, res) => {
        try {
            logger.warning("Restablecer contraseña")
            res.render('restartpassword', {
                style: 'index.css'
            })
            
        } catch (error) {
            res.send({
                status: "error",
                error: error.message
            })            
        }
    }
}

export default SessionController
