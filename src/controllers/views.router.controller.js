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
            // logger.debug(`contenido de products: ${products}`)

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
            const { username, role, cartId } = req.query
            const products = await this.viewsRouterService.get()
            res.render('productosActualizados', {
                username:  username,
                productos: products,
                cartId:    cartId,
                IsAdmin:   role === 'admin',
                style:     'index.css'
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
            console.log(`contenido de cid: ${JSON.stringify(cid)}`);

            const cart = await this.viewsRouterService.getBy({ _id: cid })
            console.log(`Contenido de cart en la vista: ${JSON.stringify(cart, null, 2)}`)

            if (!cart) {
                throw new Error('carrito no encontrado')
            }

            res.render('cart', {
                cart,
                style: 'index.css'
            })
        } catch (error) {
            console.error("Error al intentar obtener el carrito seleccionado", error);
            res.render("Error al intentar obtener el carrito!", error);
            return;
        }
    }
}