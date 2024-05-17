import { expect } from "chai";
import UserDto from "../src/dto/userDto.js";
import { createHash, isValidPassword } from "../src/utils/hashBcrypt.js";

describe('Testing de Bcrypt', () => {
    it('El servicio debe devolver un hash válido de password', async function(){
        const password     = '12345'
        const passwordHash = await createHash(password)

        console.log(passwordHash)
        expect(passwordHash).to.not.equal(password)
    })
})

    it('Testing de isValidPassword', async function(){
        const password     = '12345'
        const passwordHash = await createHash(password)

        const isValid = await isValidPassword(password, passwordHash)
        expect(isValid).to.be.true
        expect(isValid).to.equal(true)
})

// describe('Testing de UserDto', () => {
//     before(function () {
//         this.userDto = new UserDto()
//     })

//     it('El Dto debe poder devolver el primer nombre y el apellido de un campo llamado name, sin el password', async function(){
//         let mockUser = {
//             first_name: 'Manu',
//             last_name: 'Petit',
//             username: "manu66",
//             email: 'manuriver@gmail.com',
//             password: '12345'
//         }

//         const result = this.userDto.get(mockUser)

//         expect(result).to.have.property()
//     })
// })

