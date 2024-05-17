import { configObject } from "../config/connectDB.js";
import connectDB from "../config/connectDB.js";

let UserDao
let ProductDao
let CartDao

try {
    switch (configObject.persistence) {
        case 'FILE':
            const UserDaoFile = (await import('./FileSytem/userDaoFile.js')).default
            UserDao = UserDaoFile
    
            const ProductDaoFile = (await import('./FileSytem/productDaoFile.js')).default
            ProductDao = ProductDaoFile
    
            const CartDaoFile = (await import('./FileSytem/cartDaoFile.js')).default
            CartDao = CartDaoFile
    
            break;
        case 'MEMORY':
    
            break;
    
        default:
            connectDB()
    
            const UserDaoMongo = (await import('./Mongo/userDaoMongo.js')).default
            UserDao = UserDaoMongo
    
            const ProductDaoMongo = (await import('./Mongo/productsDaoMongo.js')).default
            ProductDao = ProductDaoMongo
    
            const CartDaoMongo = (await import('./Mongo/cartsDaoMongo.js')).default
            CartDao = CartDaoMongo
    
            break;
    }
} catch (error) {
    console.error('Error al inicializar los DAO:', error);
}


class DAOFactory {
    static getUserDao() {
        return new UserDao()
    }

    static getProductDao() {
        return new ProductDao()
    }

    static getCartDao() {
        return new CartDao()
    }
}

export default DAOFactory