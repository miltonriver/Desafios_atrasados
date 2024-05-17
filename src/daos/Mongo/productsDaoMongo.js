import productModel from "./models/products.model.js"

class ProductDaoMongo {
    async get(){
        return await productModel.find({})
    }

    async getProductPaginate(page = 1, limit = 5){//comprobar funcionamiento
        const options = {
            page: page,
            limit: limit
        };
        return await productModel.paginate({}, options)
    }

    async getBy(pid){
        return await productModel.findOne({_id: pid})
    }
    
    async create(newProduct){
        return await productModel.create(newProduct)
    }
    
    async update(pid, productToUpdate){
        return await productModel.findOneAndUpdate({_id: pid}, productToUpdate, {new: true})
    }
    
    async delete(pid){
        return await productModel.deleteOne({_id: pid})
    }
}

export default ProductDaoMongo