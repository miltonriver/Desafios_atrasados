import fs from 'fs';
import path from 'path';
import { logger } from '../../utils/logger.js';

const filePath = 'productos.json';
class ProductsDaoFile {
    constructor(filePath = 'productos.json') {
        this.products = [];
        this.path = path.resolve(filePath);
        this.loadFromFile(this.path);
    }

    async readFile() {
        try {
            const dataProducts = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(dataProducts)
        } catch (error) {
            return []
        }
    }

    get() {
        return this.products;
    }

    async getBy(pid) {
        try {
            const otroProducto = await this.products.find(prod => prod.id === pid)
            if (!otroProducto)
                return `El articulo seleccionado con ID "${pid}" no existe`
    
            return otroProducto            
        } catch (error) {
            return error
        }
    }

    async create(product) {
        try {
            if(!product.status){
                product.status = true;
            }

            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock || !product.category){
                logger.warning(`Todos los campos del artículo con nombre "${product.title}" deben contener datos`);
                return `Todos los campos del artículo con nombre "${product.title}" deben contener datos`
            }
    
            const newProduct = await this.products.find(prod => prod.code === product.code);
            if (newProduct) {
                logger.warning(`El código del artículo con nombre "${product.title}" no puede estar repetido`);
                return "No es posible cargar más de un producto con el mismo código"
            }
    
            product.id = (this.products.length + 1)* Math.random()
            this.products.push(product);
            logger.info(`Se agregó el artículo con nombre "${product.title}" al arreglo`);
    
            await this.saveToFile();
    
            return `${product.title} agregado`            
        } catch (error) {
            console.error('Error en addProduct:', error);
            return error
        }
    }

    async update(pid, updatedFields) {
        try {
            const productIndex = this.products.findIndex(prod => prod.id === pid);
            if (productIndex === -1) {
                throw new Error(`El artículo con ID "${pid}" no existe`);
            }
    
            // Validar que al menos un campo sea proporcionado
            if (!Object.keys(updatedFields).length) {
                throw new Error(`Debe proporcionar al menos un campo para actualizar`);
            }
    
            // Actualizar solo los campos proporcionados
            this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
    
            await this.saveToFile()
    
            return `El artículo con ID "${pid}" ha sido actualizado`;            
        } catch (error) {
            return error;
        }
    }

    async delete(pid) {
        try {
            const eliminarProducto = this.products.filter(prod => prod.id !== pid)
            
            if (eliminarProducto.length === this.products.length ){
                return `El producto cuyo ID es "${pid}" no existe, no se puede eliminar un producto que no existe`
            }
            if (eliminarProducto) {
                logger.info(`Se eliminó el artículo con ID "${pid}" del arreglo`)
                this.products = eliminarProducto
                await this.saveToFile()
                return this.products//eliminarProducto
            }
            
            
        } catch (error) {
            return error
        }
    }

    async saveToFile() {
        const data = JSON.stringify(this.products, null, 2);
        //console.log('Datos a guardar:', data); // Agregar esta línea
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
            this.products = JSON.parse(data);
            logger.info(`Datos cargados desde el archivo: "${this.path}"`);
        } catch (error) {
            console.error('Error al cargar datos desde el archivo:', `El archivo "${this.path}" no está bien definido o no existe`);
            // Si hay un error al cargar desde el archivo, iniciar con un array vacío
            this.products = [];
        }
    }
}

//Crear una instancia de la clase ProductsManager
const productos = new ProductsDaoFile()

export default ProductsDaoFile