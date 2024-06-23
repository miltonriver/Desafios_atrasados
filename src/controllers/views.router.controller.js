import DAOFactory from "../daos/factory.js";
import { logger } from "../utils/logger.js";

export class ViewUserController {
    constructor(){
        this.viewsRouterService = DAOFactory.getUserDao()
    }

    index     = async (req, res) => {
        res.render("index", {
            style: 'index.css'
        })
    }

    register  = async (req, res) => {
        res.render('register', {
            style: 'index.css'
        })
    }

    login     = async (req, res) => {
        res.render('login', {
            style: 'index.css'
        })
    }

    chatbox   = async (req, res) => {
        res.render('chat', {
            style: 'index.css'
        })
    }

    usersList = async (req, res) => {
        try {
            const { limit = 5, pageQuery= 1, sort } = req.query
            let sortOption = {}
            if (sort) {
                sortOption = {[sort]: 1}
            }
    
            const {
                docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page,
                totalPages
            } = await this.viewsRouterService.getUsersPaginate(parseInt(pageQuery), parseInt(limit));
            //console.log(docs)
            res.render('users', {
                users: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page,
                totalPages,
                style: 'index.css'
            })
            
        } catch (error) {
            logger.error("Error al intentar obtener la lista de usuarios: ", error);
            res.render("Error al intentar obtener la lista de usuarios!");
            return;
        }
    }
}

export class ViewProductController {
    constructor(){
        this.viewsRouterService = DAOFactory.getProductDao()
    }

    realTimeProducts      = async (req, res) => {

        try {
            if(!req.user) {
                return res.redirect('/login')
            }

            const products = await this.viewsRouterService.get()

            const productsStringIds = products.map(product => {
                const productCopy = { ...product };
                productCopy._id = product._id.toString();
                return productCopy;
            });

            const username = req.user.username

            res.render('realTimeProducts', {
                productos: productsStringIds,
                username,
                style: 'index.css'
            })
        } catch (error) {
            logger.error("Error al intentar obtener la lista de productos en tiempo real: ", error);
            res.render("Error al intentar obtener la lista de productos!");
            return;
        }
    }

    productosActualizados = async (req, res) => {
        try {
            const products = await this.viewsRouterService.get()
            const { role, username } = req.user

            res.render('productosActualizados', {
                productos: products,
                IsAdmin: role === 'admin',
                username,
                style: 'index.css'
            })
        } catch (error) {
            logger.error("Error al intentar obtener la lista de productos actualizados: ", error);
            res.render("Error al intentar obtener la lista de productos!");
            return;
        }
    }

    updateProduct = async (req, res) => {
        try {
            const { title, description, price, thumbnail, code, stock, status, category, _id } = req.body
            const newProduct = { title, description, price, thumbnail, code, stock, status, category, _id }

            for (let key in newProduct) {
                if (typeof newProduct[key] === 'string') {
                    newProduct[key] = newProduct[key].trim()
                }
                if (newProduct[key] === '') {
                    delete newProduct[key]
                }
            }

            if (newProduct.price) {
                newProduct.price = parseFloat(newProduct.price)
            }
            if (newProduct.stock) {
                newProduct.stock = parseInt(newProduct.stock, 10)
            }
            
            if (newProduct.price && isNaN(newProduct.price) || newProduct.price <= 0) {
                logger.warning(`El precio del artículo debe ser un valor numérico mayor que 0`)
                res.status(400).send({
                    status:  'Error',
                    message: 'El precio del artículo debe ser un número y no puede ser 0 o negativo'
                })
            }
            if (newProduct.stock && isNaN(newProduct.stock) || newProduct.stock <= 0) {
                logger.warning(`La cantidad del producto a agregar debe ser un valor numérico entero mayor que 0`)
                res.status(400).send({
                    status:  'Error',
                    message: 'El stock del producto debe ser un número entero y no puede ser 0 o negativo'
                })
            }

            const productToUpdate = await this.viewsRouterService.update(newProduct._id, newProduct)
            logger.debug(`Producto actualizado: ${productToUpdate}`)

            const products = await this.viewsRouterService.get()
            const { role, username } = req.user

            res.render('productosActualizados', {
                productos: products,
                IsAdmin: role === 'admin',
                username,
                style: 'index.css'
            })
        } catch (error) {
            logger.error("Error al intentar obtener la lista de productos actualizados: ", error);
            res.render("Error al intentar obtener la lista de productos!");
            return;
        }
    }
    
    products              = async (req, res) => {
        try {
            const { limit = 5, pageQuery= 1, sort } = req.query
            let sortOption = {}
            if (sort) {
                sortOption = {[sort]: 1}
            }
            const options = {
                page: parseInt(pageQuery, 10),
                limit: parseInt(limit, 10),
                sort: sortOption,
                lean: true
            };
    
            const result = await this.viewsRouterService.getProductPaginate(options.page, options.limit);
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page, totalPages } = result;

            logger.debug(`contenido de Docs: ${docs}`)
            logger.debug(`${page}, ${totalPages}, ${limit}, ${hasNextPage}, ${hasPrevPage}, ${nextPage}`)
            res.render('products', {
                products: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page,
                totalPages,
                style: 'index.css'
            })
            
        } catch (error) {
            logger.error("Error al intentar obtener la lista de productos: ", error);
            res.render("Error al intentar obtener la lista de productos!");
            return;
        }
    }

    getProducts           = async (req, res) => {
        try {
            const products = await this.viewsRouterService.get()
            res.render('realTimeProducts', {
                productos: products,
                style: 'index.css'
            })
        } catch (error) {
            logger.error("Error al intentar obtener la lista de productos!", error);
            res.render("Error al intentar obtener la lista de productos!");
            return;
        }
    }
}

export class ViewCartController {
    constructor(){
        this.viewsRouterService = DAOFactory.getCartDao()
    }

    cartView = async (req, res) => {
        try {
            
            const { cid } = req.params
            
            const cart    = await this.viewsRouterService.getBy({ _id: cid })

            let totalIndividualCompra = []
            let totalGeneralCompra    = 0

            for (let i = 0; i < cart.products.length; i++) {
                const totalBuy = cart.products[i].quantity * cart.products[i].product.price
                logger.info(`Total obtenido durante la iteración nro ${i}: $ ${totalBuy}`)
                totalIndividualCompra.push(totalBuy)
                totalGeneralCompra += totalBuy
            }

            if (!cart) {
                throw new Error('carrito no encontrado')
            }

            res.render('cart', {
                cart,
                totalIndividualCompra,
                totalGeneralCompra,
                style: 'index.css'
            })
        } catch (error) {
            console.error("Error al intentar obtener el carrito seleccionado", error);
            res.render("Error al intentar obtener el carrito!", error);
            return;
        }
    }
}