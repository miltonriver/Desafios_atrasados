// import UserDaoMongo from "../daos/Mongo/userDaoMongo.js";
// import ProductDaoMongo from "../daos/Mongo/productsDaoMongo.js";
import DAOFactory from "../daos/factory.js";
import { logger } from "../utils/logger.js";

export class ViewUserController {
    constructor(){
        this.viewsRouterService = DAOFactory.getUserDao()
    }

    index = (req, res) => {
        res.render("index", {
            style: 'index.css'
        })
    }

    register = (req, res) => {
        res.render('register', {
            style: 'index.css'
        })
    }

    registerPassport = (req, res) => {
        res.render('registerpassport', {
            style: 'index.css'
        })
    }

    login = (req, res) => {
        res.render('login', {
            style: 'index.css'
        })
    }

    loginPassport = (req, res) => {
        res.render('loginpassport', {
            style: 'index.css'
        })
    }

    chatbox = (req, res) => {
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
            } = await this.viewsRouterService.getUsersPaginate(parseInt(pageQuery) , parseInt(limit));
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
            logger.error(error);
            res.render("Error al intentar obtener la lista de usuarios!");
            return;
        }
    }
}

export class ViewProductController {
    constructor(){
        this.viewsRouterService = DAOFactory.getProductDao()
    }

    realTimeProducts = async (req, res) => {

        try {
            const products = await this.viewsRouterService.get()
            const productsStringIds = products.docs.map(product => {
                const productCopy = { ...product };
                productCopy._id = product._id.toString();
                return productCopy;
            });

            res.render('realTimeProducts', {
                productos: productsStringIds,
                style: 'index.css'
            })
        } catch (error) {
            logger.error(error);
            res.render("Error al intentar obtener la lista de productos!");
            return;
        }
    }

    productosActualizados = async (req, res) => {

        try {
            const products = await this.viewsRouterService.get()
            res.render('productosActualizados', {
                username: req.session.username,
                productos: products,
                style: 'index.css'
            })
        } catch (error) {
            logger.error(error);
            res.render("Error al intentar obtener la lista de productos!");
            return;
        }
    }
    
    products = async (req, res) => {
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
            } = await this.viewsRouterService.get({}, {limit, page: pageQuery, sort: sortOption, lean: true})
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
            logger.error(error);
            res.render("Error al intentar obtener la lista de productos!");
            return;
        }
    }

    getProducts = async (req, res) => {
        try {
            const products = await this.viewsRouterService.get()
            res.render('realTimeProducts', {
                productos: products,
                style: 'index.css'
            })
        } catch (error) {
            logger.error(error);
            res.render("Error al intentar obtener la lista de productos!");
            return;
        }
    }
}