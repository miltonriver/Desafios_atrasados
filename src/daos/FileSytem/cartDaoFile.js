import fs from 'fs';
import { logger } from '../../utils/logger.js';

class CartDaoFile {
    constructor(FilePath = 'carrito.json') {
        this.carts = [];
        this.path = FilePath;
        this.loadFromFile(this.path);
    }

    async readFile() {
        try {
            const dataCarts = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(dataCarts)
        } catch (error) {
            return []
        }
    }

    async get() {
        return await this.readFile()
            .then(data => data)
            .catch(error => {
                console.error(`Error al obtener carritos: ${error}`);
                return [];
            });
    }

    async getBy(cid) {
        
        try {
            const carts = await this.readFile()
            const cardId = carts.find(cart => cart.id === cid)

            return cardId 
            //return `El carrito con ID "${cid}"no existe`;
            
        } catch (error) {
            return `El carrito con ID "${cid}"no existe ${error}`;
            null
        }
    }

    async create() {
        
        try {
            const carts = await this.readFile()

            let newCart = {
                id: carts.length + 1,
                products: []
            }
            carts.push(newCart)

            await this.saveToFile()
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), { encoding: 'utf-8' })
            return carts

        } catch (error) {
            return `Error al intentar crear un carrito ${error}`
        }
    }

    async addProductToCart(cid, pid) {

        try {
            const carts = await this.readFile()
            const cartIndex = carts.findIndex(cart => cart.id === cid)
            if (cartIndex === -1){
                return `El carrito con ID "${cid}" no existe`
            }
    
            const productIndex = carts[cartIndex].products.findIndex(prod => prod.id === pid)
            if (productIndex === -1){
                carts[cartIndex].products.push({
                    id: pid,
                    quantity: 1
                })
            } else {
                carts[cartIndex].products[productIndex].quantity ++
            }
            
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8')
            return carts[cartIndex]
            
        } catch (error) {
            return error
        }
    }

    async saveToFile() {
        const data = JSON.stringify(this.carts, null, 2);
        await fs.promises.writeFile(this.path, data, 'utf8')
            .then(() => {
                logger.info('Datos guardados en el archivo:', this.path);
            })
            .catch((error) => {
                console.error('Error al guardar datos en el archivo:', error);
            });
    }

    loadFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.carts = JSON.parse(data);
            logger.info(`Datos cargados desde el archivo: "${this.path}"`);
        } catch (error) {
            console.error('Error al cargar datos desde el archivo:', `El archivo "${this.path}" no está bien definido o no existe`);
            // Si hay un error al cargar desde el archivo, iniciar con un array vacío
            this.carts = [];
        }
    }

}

const cartsService = new CartDaoFile()

export default cartsService