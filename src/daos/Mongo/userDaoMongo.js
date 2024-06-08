import userModel from "./models/users.model.js"

class UserDaoMongo {
    async get(){
        return await userModel.find({}).lean()
    }

    async getUsersPaginate(page = 1, limit = 5){
        const options = {
            page: page,
            limit: limit
        };
        return await userModel.paginate({}, options)
    }

    async getBy(username){
        return await userModel.findOne({username})
    }

    async getByEmail(email){
        return await userModel.findOne({email})
    }

    async create(newUser){
        return await userModel.create(newUser)
    }

    async update(uid, userToUpdate){
        return await userModel.findOneAndUpdate({_id: uid}, userToUpdate, {new: true})
    }
    
    async delete(uid){
        return await userModel.findOneAndDelete(uid)
    }
}

export default UserDaoMongo