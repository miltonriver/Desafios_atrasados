import { userService } from "../services/index.js";
import { logger } from "../utils/logger.js";
import { createHash } from "../utils/hashBcrypt.js";

class UserController {
    constructor(){
        this.userService = userService
    }
    
    getUsers   = async (req, res) => {
        try {
            const users = await this.userService.getUsers();
            res.send(users);
        } catch (error) {
            logger.error(`Error al obtener el usuario: ${error.message}`);
            logger.info("No se puede encontrar la lista de usuarios por un error desconocido");
            res.status(500).send({ error: "Error al obtener usuarios" });
        }
    };
    
    getUser    = async (req, res) => {
        try {
            const { username } = req.params
            const user = await this.userService.getUser(username)
            logger.debug(user)
            res.json({
                status: "success",
                message: `Usuario ${user.first_name} ${user.last_name} encontrado`,
                result: user
            })
        } catch (error) {
            logger.error('Error al buscar el usuario: ', error.message)
            logger.info("No se puede encontrar el usuario por un error desconocido")
        }
    }
    
    createUser = async (req, res) => {
        try {
            const { first_name, last_name, email, username, password, age, phone_number, role } = req.body
            const newUser = {
                first_name,
                last_name,
                email,
                username,
                password: createHash(password),
                age,
                phone_number,
                role
            }
    
            const result =await this.userService.createUser(newUser)
    
            res.status(200).send({
                status: "success",
                message: `El usuario ${first_name} ${last_name} ha sido creado con éxito`,
                usersCreate: result
            })
            logger.warning(`El usuario ${first_name} ${last_name} ha sido creado con éxito`)
        } catch (error) {
            logger.error('Error al crear el usuario: ', error)
        }
    }
    
    updateUser = async (req, res) => {
        try {
            const { uid } = req.params
            const userToUpdate = req.body
    
            const result = await this.userService.updateUser(uid, userToUpdate) //se usa para mostrar el usuario actualizado en tiempo real, dado que el sistema tenderá a mostrarnos el usuario actualizado pero sin actualizar
            res.status(200).send({
                status: "success",
                message: `El usuario ${result.first_name} ${result.last_name} con id "${uid}" ha sido actualizado`,
                result: result          
            })
        } catch (error) {
            logger.error(`Error al intentar actualizar el usuario ${error.message}`)
            logger.warning("No se puede actualizar por un error desconocido")
        }
    }

    deleteUser = async (req, res) => {
        try {
            const { username } = req.params
            const userToDelete = await this.userService.getUser(username)
            logger.info(userToDelete)

            if (!userToDelete) {
                logger.warning(`El usuario de ${username} no existe en la base de datos`)
                return res.status(404).send({
                    status: 'error',
                    message: 'El usuario seleccionado no existe'
                });
            }

            const userId = userToDelete._id

            await this.userService.deleteUser(userId)

            res.status(200).send({
                status: 'success',
                message: `El usuario ${username} ha sido eliminado exitosamente`
            })
        } catch (error) {
            logger.error(`Hay un problema al intentar eliminar el usuario seleccionado ${error.message}`)
            res.status(500).send({
                status: 'error',
                message: 'Hubo un problema al intentar eliminar el usuario'
            })
        }
    }

    verifyUser = async (req, res) => {
        const { username } = req.body;
        try {
            const user = await this.userService.getUser(username);
            if (user && (user.role === 'user' || user.role === 'user_premium')) {
                res.status(200).send({
                    status: 'success',
                    message: 'Usuario verificado'
                });
            } else {
                res.status(404).send({
                    status: 'error',
                    message: 'Usuario no encontrado o no autorizado'
                });
            }
        } catch (error) {
            logger.error('Error al verificar el usuario: ', error);
            res.status(500).send({
                status: 'error',
                message: 'Error del servidor'
            });
        }
    }
}

export default UserController