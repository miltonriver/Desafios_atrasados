import mongoose from "mongoose";
import CartDaoMongo from "../src/daos/Mongo/cartsDaoMongo.js";
import Assert from "node:assert";
import { configObject } from "../src/config/connectDB.js";

mongoose.connect(configObject.mongo_url)
const assert = Assert.strict

describe('Testing CartdaoMongo', () => {
    before(function(){
        this.cartDaoMongo = new CartDaoMongo()
    })

    beforeEach(function() {
        mongoose.connection.collections.carts.drop()
        this.timeout(5000)
    })

    it('El Dao debe poder obtener los carts en formato de arreglo', async function(){
        console.log(this.cartDaoMongo)

        const result = await this.cartDaoMongo.get()
        assert.strictEqual(Array.isArray(result), true)
    })

    it('El Dao debe poder agregar un carrito correctamente a la base de datos', async function(){
        let mockCart = {
            products: {}
        }

        const result = await this.cartDaoMongo.create(mockCart)
        assert.ok(result._id)
    })
})