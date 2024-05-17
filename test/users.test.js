import mongoose from "mongoose";
import UserDaoMongo from "../src/daos/Mongo/userDaoMongo.js";
import Assert from "node:assert";
import { configObject } from "../src/config/connectDB.js";

mongoose.connect(configObject.mongo_url)
// console.log(configObject.mongo_url)
const assert = Assert.strict

describe('Testing User DAO', () => {
    before(function(){
        this.userDaoMongo = new UserDaoMongo()
    })

    beforeEach(function(){
        mongoose.connection.collections.users.drop()
        this.timeout(5000)
    })

    it('El Dao debe poder obtener los usuarios en formato de arreglo', async function(){
        console.log(this.userDaoMongo)

        const result = await this.userDaoMongo.get()
        assert.strictEqual(Array.isArray(result), true)
    })

    it('El Dao debe poder agregar un usuario correctamente a la base de datos', async function(){
        let mockUser = {
            first_name: 'Manu',
            last_name: 'Petit',
            username: "manu66",
            email: 'manuriver@gmail.com',
            password: '12345'
        }

        const result = await this.userDaoMongo.create(mockUser)
        assert.ok(result._id)
    })
})