import UserDto from "../dto/userDto.js";
import UserDaoMongo from "../daos/Mongo/userDaoMongo.js";

class UserRepository {
    constructor(){
        this.dao = new UserDaoMongo()
    }

    getUsers   = async () => await this.dao.get()
    getUser    = async (username) => await this.dao.getBy(username)
    createUser = async (newUser) => {
        const newUserDto = new UserDto(newUser)
        return await this.dao.create(newUserDto)
    }
    updateUser = async (uid, userToUpdate) => await this.dao.update({_id: uid}, userToUpdate, {new: true})
    deleteUser = async (uid) => await this.dao.delete(uid)
}

export default UserRepository