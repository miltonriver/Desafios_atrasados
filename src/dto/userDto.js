class UserDto {
    constructor(user){
        this.first_name   = user.first_name
        this.last_name    = user.last_name
        this.full_name    = `${user.first_name} ${user.last_name}`
        this.username     = user.username
        this.email        = user.email
        this.password     = user.password//Debemos quitar este dato al enviar info sensible al usuario dentro de la ruta current
        this.age          = user.age
        this.phone_number = user.phone_number
        this.role         = user.role
    }
}

export default UserDto