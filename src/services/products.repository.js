import ProductDto from "../dto/productDto.js"
import ProductDaoMongo from "../daos/Mongo/productsDaoMongo.js"
class ProductRepository {
    constructor(){
        this.dao = new ProductDaoMongo()
    }

    getProducts   = async () => await this.dao.get()
    getProduct    = async (filter) => await this.dao.getBy(filter)
    createProduct = async (newProduct) => {
        const newProductDto = new ProductDto(newProduct)
        return await this.dao.create(newProductDto)
    }
    updateProduct = async (pid, productToUpdate) => await this.dao.update({_id: pid}, productToUpdate, {new: true})
    deleteProduct = async (pid) => await this.dao.delete({_id: pid})
}

export default ProductRepository