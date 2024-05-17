import CartDto from "../dto/cartDto.js";
import CartDaoMongo from "../daos/Mongo/cartsDaoMongo.js";

class CartRepository {
    constructor(){
        this.dao = new CartDaoMongo()
    }

    getCarts   = async () => await this.dao.get()
    getCart    = async (filter) => await this.dao.getBy(filter)
    createCart = async (newCart) => {
        const newCartDto = new CartDto(newCart)
        return await this.dao.create(newCartDto)
    }
    updateCart = async (cid, cartToUpdate) => await this.dao.update({_id: cid}, cartToUpdate, {new: true})
    deleteCart = async (cid) => await this.dao.delete({_id: cid})
}

export default CartRepository