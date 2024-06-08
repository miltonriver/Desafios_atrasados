import DAOFactory       from "../daos/factory.js";
import { userService,
        cartService}    from "../services/index.js";
import { isValidPassword,
        createHash }    from "../utils/hashBcrypt.js";
import generateToken    from "../utils/jsonwebtoken.js";
import { logger }       from "../utils/logger.js";
import UserDto          from "../dto/userDto.js";
import { restartEmail } from "../utils/sendEmail.js";
import jwt              from "jsonwebtoken";
import { configObject } from "../config/connectDB.js";

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
            const newUser = {
                first_name,
                last_name,
                username,
                email,
                password: createHash(password),
                phone_number: phoneNumber
            }
            const result = await userService.createUser(newUser)
            const newCart = { userEmail: newUser.email, products: [] }
            const newCartCreated = await cartService.createCart(newCart)
            result.cartId = newCartCreated._id
            await result.save()

            const token = generateToken({
                fullname: fullname,
                username: username,
                role: result.role,
                cartId: result.cartId,
                id: result._id
            })

            logger.info(`Token: ${token}`)

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

            if (!user) {
                return res.send({
                    status: "error",
                    error: "El usuario no existe o no está registrado"
                })
            }

            if (!isValidPassword(password, user.password)) {
                logger.error('las credenciales no coinciden, no se puede iniciar sesión')
                return res.status(401).send('las credenciales no coinciden')
            }
            const cartId = user.cartId

            const token = generateToken({
                fullname: `${user.first_name} ${user.last_name}`,
                username: username,
                cartId: cartId ? cartId._id : null,
                role: user.role,
                id: user._id
            })
            logger.debug(`contenido de token: ${token}`)
            logger.info(`Sesión iniciada correctamente, bienvenido usuario ${username}`)

            res.cookie('cookieToken', token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true,
                secure: false
            })

            res.json({ token, role: user.role })

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
                return res.status(404).send({ message: "user not found" })
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

    emailRestart = async (req, res) => {
        try {
            const { email } = req.body
            const subject = 'Email para recuperación de contraseña'
            const token = generateToken({ email, expiresIn: '1h' })
            logger.debug(`contenido de token: ${token}`)
            const resetLink = `http://localhost:8000/api/sessions/resetpassword/${token}`
            const html = `<div><h1>Recuperación de contraseña</h1></div>
                        <p>Si usted no ha enviado ninguna solicitud para recuperar su contraseña por favor desestime el correo, de lo contrario siga el siguiente enlace <a href="${resetLink}">reset password</a></p>
                        <p>Este enlace expirará dentro de una hora</p>`

            await restartEmail({ service: 'miltonriver66@gmail.com', to: email, subject, html })

            res.json({ status: 'success', message: 'Email enviado' })
        } catch (error) {
            logger.error(`Error al enviar el correo: ${error.message}`)
            res.send({
                status: "error",
                error: error.message
            })
        }
    }

    resetPassword = async (req, res) => {
        try {
            logger.warning("Restauración de contraseña")
            const { token } = req.params
            res.render('resetpassword', {
                token,
                style: 'index.css'
            })

        } catch (error) {
            res.send({
                status: "error",
                error: error.message
            })
        }
    }

    newPassword = async (req, res) => {
        try {
            const { token, email, newPassword, newPasswordConfirmed } = req.body
            const decodedToken = jwt.verify(token, configObject.jwt_private_Key)
            if (!decodedToken) {
                return res.status(400).send({
                    status: "error",
                    message: "No hay token de autorización"
                })
            }

            const user = await this.sessionService.getByEmail(decodedToken.email)
            logger.debug(`contenido de user: ${user}`)

            if(email !== user.email) {
                return res.status(400).send({
                    status: "error",
                    message: "El email no pertenece al usuario"
                })
            }

            if (!newPassword || !newPasswordConfirmed) {
                return res.status(400).send({
                    status: "error",
                    message: "Las contraseñas no pueden estar vacias"
                })
            }
            if (newPassword !== newPasswordConfirmed) {
                return res.status(400).send({
                    status: "error",
                    message: "Las contraseñas no coinciden"
                })
            }

            

            const isValid = isValidPassword(newPassword, user.password)
            if(isValid) {
                return res.status(400).send({
                    status: "error",
                    message: "La contraseña nueva no puede ser igual que la anterior, por favor elija una nueva contraseña"
                })
            }

            const newPasswordHash = createHash(newPassword)
            user.password = newPasswordHash
            await user.save()

            return res.status(200).json({
                status: "success",
                message: "La contraseña ha sido actualizada con éxito"
            })
        } catch (error) {
            logger.error(`Error al intentar resetear el password: ${error.message}`)
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
