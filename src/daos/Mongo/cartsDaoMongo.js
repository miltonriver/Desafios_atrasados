import cartModel from "./models/carts.model.js"

class CartDaoMongo {
    async get(){
        return await cartModel.find({})
    }

    async getBy(filter){
        return await cartModel.findOne(filter)
    }

    async create(newCart){
        return await cartModel.create(newCart)
    }
    
    async update(cid){
        return await cartModel.findOneAndUpdate({_id: cid},  {new: true})
    }

    async delete(cid){
        return await cartModel.deleteOne({_id: cid})
    }
}

export default CartDaoMongo