import bcrypt from "bcrypt";

export const createHash = async password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// export const isValidPassword = async (password, passwordUser) => bcrypt.compareSync(password, passwordUser)
export const isValidPassword = async (password, hash) => bcrypt.compare(password, hash)

// export const createHash = async(password) => {
//     const salts = await bcrypt.genSalt(10)
//     return await bcrypt.hash(password, salts)
// }

// export const passwordValidation = async(user, password) => bcrypt.compare(password, user.password)