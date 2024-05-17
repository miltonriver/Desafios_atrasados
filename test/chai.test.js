import mongoose from "mongoose";
import UserDaoMongo from "../src/daos/Mongo/userDaoMongo.js";
import { expect } from "chai";
import { configObject } from "../src/config/connectDB.js";

mongoose.connect(configObject.mongo_url)

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
        // expect(result).to.be.deep.equal([])
        expect(Array.isArray(result)).to.be.ok
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
        expect(result).to.have.property('_id')
        expect(result).to.have.property('first_name', 'Manu')
        expect(result).to.be.an('object')
    })
})
