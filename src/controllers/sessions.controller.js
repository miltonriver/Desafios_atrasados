import DAOFactory         from "../daos/factory.js";
import { userService, 
        cartService }     from "../services/index.js";
import { createHash, 
        isValidPassword } from "../utils/hashBcrypt.js";
import generateToken      from "../utils/jsonwebtoken.js";
import { logger }         from "../utils/logger.js";
import UserDto            from "../dto/userDto.js";

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

            const phoneNumber = phone_number && phone_number.trim() !== '' ? phone_number : 1111111111
            const newUser     = {
                first_name,
                last_name,
                username,
                email,
                password: createHash(password),
                phone_number: phoneNumber
            }
            const result         = await userService.createUser(newUser)
            const newCart        = { userEmail: newUser.email, products: [] }
            const newCartCreated = await cartService.createCart(newCart)
            result.cartId        = newCartCreated._id
            await result.save()

            const token = generateToken({
                fullname: fullname,
                username: username,
                role:     result.role,
                cartId:   result.cartId,
                id:       result._id
            })

            logger.info(`Token: ${token}` )

            res.cookie('cookieToken', token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true
            }).render('registerSuccess', {//Modificar esta ruta para poder agregarla al router de vistas
                username: username,
                fullname: fullname,
                usersCreate: result,
                style: "index.css"
            })

        } catch (error) {
            logger.error(`Error desconocido al crear usuario: ${error.message}`),
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
            logger.debug(`Contenido del usuario: ${JSON.stringify(user, null, 2)}`)
            
            if (!user) {
                return res.send({
                    status: "error",
                    error: "El usuario no existe o no está registrado"
                })
            }

            if (!isValidPassword(password, user.password)){
                logger.error('las credenciales no coinciden, no se puede iniciar sesión')
                return res.status(401).send('las credenciales no coinciden')
            } 
            const cartId = user.cartId
            logger.debug(`Contenido inicial de cartId: ${JSON.stringify(cartId, null, 2)}`)

            const token = generateToken({
                fullname: `${user.first_name} ${user.last_name}`,
                username: username,
                cartId:   cartId ? cartId._id : null,
                role:     user.role,
                id:       user._id
            })
            logger.debug(`contenido de token: ${token}`)
            logger.info(`Sesión iniciada correctamente, bienvenido usuario ${username}`)

            res.cookie('cookieToken', token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true,
                secure: false
            })

            res.json({ token, role: user.role })

            // res.redirect(`/productosactualizados?username=${username}&isAdmin=${user.role === 'admin'}`)

        } catch (error) {
            logger.error('Error al intentar loguearse: ', error.messsage)
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
            res.clearCookie('cookieToken')
            res.send(`
                <script>
                    sessionStorage.clear();
                    alert('Logout success');
                    window.location.href = '/login'
                </script>
            `)
        } catch (error) {
            logger.error(`Mensaje de error: ${error.message}`)
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

    tokenMiddleware = async (req, res) => {
        try {
            const username = req.user.username
            const user = await this.sessionService.getBy(username)

            if (!user) {
                return res.status(404).send({message: "user not found"})
            }

            const userDto = new UserDto(user)
            logger.debug(`Contenido de userDto: ${JSON.stringify(userDto)}`)

            delete userDto.password
            delete userDto.first_name
            delete userDto.last_name
            delete userDto.role            

            res.status(200).send(userDto)
        } catch (error) {
            res.status(500).send({
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

    // githubLogin = async (req, res) => { }

    // githubCallback = async (req, res) => {
    //     try {
    //         req.session.user = req.user
    //         res.redirect('/realtimeproducts')

    //     } catch (error) {
    //         res.send({
    //             status: "error",
    //             error: error.message
    //         })
    //     }
    // }
}

export default SessionController
