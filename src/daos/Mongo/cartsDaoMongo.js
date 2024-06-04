import cartModel from "./models/carts.model.js"

class CartDaoMongo {
    async get(){
        return await cartModel.find({}).lean()
    }

    async getBy(cid){
        return await cartModel.findOne({ _id: cid })
    }

    async create(newCart){
        return await cartModel.create(newCart)
    }
    
    async update(cid, cartToUpdate){
        return await cartModel.findOneAndUpdate({_id: cid}, { $set: cartToUpdate }, {new: true})
    }

    async delete(cid){
        return await cartModel.deleteOne({_id: cid})
    }
}

export default CartDaoMongo