import { Router } from "express";
import sendEmail from "../utils/sendEmail.js";
import sendSms from "../utils/sendSMS.js";
import { faker } from "@faker-js/faker";

const pruebasRouter = Router();

const generateProducts = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        departament: faker.commerce.department(),
        stock: parseInt(faker.string.numeric()),
        description: faker.commerce.productDescription,
        id: faker.database.mongodbObjectId(),
        image: faker.image.url()
    }
}

pruebasRouter.get("/mockingproducts", (req, res) => {
    let products = []
    for (let i = 0; i < 100; i++) {
        products.push(generateProducts())
    }
    res.send({
        status: '',
        payload: products
    })
})

const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName()
    }
}

const generateProductInCart = () => {
    let product = []
    product.push(generateProduct())
    return {
        id: faker.database.mongodbObjectId(),
        quantity: parseInt(faker.string.numeric(1, { bannedDigits: ['0']})),
        product
    }
}

const generateCart = () => {
    let products = []
    products.push(generateProductInCart())
    return {
        id: faker.database.mongodbObjectId(),
        products
    }
}

const generateUser = () => {
    let numberOfCarts = parseInt(faker.string.numeric(1, { bannedDigits: ['0']}))//el primer número indica el número de dígitos de productos que puede tener el carrito como máximo (desde el 0 a 9), el segundo me "banea" el número 0 (o sea el carrito no podría estar vacío (tendrá mínimo 1 producto, máximo 9))
    let carts = []

    for (let i = 0; i < numberOfCarts; i++) {
        carts.push(generateCart())        
    }
    return {
        id: faker.database.mongodbObjectId(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        sex: faker.person.sex(),
        birthDate: faker.date.birthdate(),
        phone: faker.phone.number(),
        image: faker.image.avatar(),
        email: faker.internet.email(),
        carts
    }
}

pruebasRouter.get("/mockingusers", (req, res) => {
    let users = []
    for (let i = 0; i < 10; i++) {
        users.push(generateUser())
    }
    res.send({
        status: '',
        payload: users
    })
})

//Router de Winston logger, porque acá funciona sin hacer la importación y en los demás archivos no funciona??
pruebasRouter.get('/loggerTest', (req, res) => {
    req.logger.fatal('¡Alerta!, Error fatal producido')
    req.logger.error('¡Alerta!, error del programa')
    req.logger.warning('¡Alerta!, warning ejecutandose')
    req.logger.info('Algún error puede estar afectando al sistema')
    
    if (process.env.MODO === "DESARROLLO") {
        req.logger.http(`${req.method} en ${req.url}, visible solo en el entorno de DESARROLLO`)
    req.logger.debug('Método visible solo en el entorno de DESARROLLO')
    }

    res.send('logger ejecutado')
})

pruebasRouter.get('/session', (req, res) => {
    if (req.session.counter) {
        req.session.counter++
        res.send(`Ud a visitado el sitio ${req.session.counter} veces`)
    } else {
        req.session.counter = 1
        res.send('Bienvenido a la página')
    }
})

pruebasRouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.send('Logout error')
        res.send({
            status: 'success',
            message: 'logout ok'
        })
    })
})

pruebasRouter.get('/mail', (req, res) => {
    const destinatario = 'miltonriver66@gmail.com'
    const subject = 'Email de prueba ecommerce Milton'
    const html = '<div><h1>Este es otro email de prueba minuto 36:20 del video</h1></div>'

    sendEmail(destinatario, subject, html)

    res.send('email enviado')
})

pruebasRouter.get('/sms', (req, res) => {
    sendSms('Milton', 'Petitfour')

    res.send("sms enviado")
})

export default pruebasRouter;