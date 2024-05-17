import { Schema, model } from "mongoose";

const cartsCollection = 'carts'

const cartSchema = new Schema({
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'products',
                index: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }]
    }   
})

cartSchema.pre('findOne', function () {
    this.populate('products.product')
})
export default model(cartsCollection, cartSchema);