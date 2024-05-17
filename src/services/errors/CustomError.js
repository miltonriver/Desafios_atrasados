class CustomError {
    static createError({name = "Error", cause = "", message = "no declarado", code = 1}){
        let error = new Error(message)
        error.name        = name
        error.code        = code
        error.cause       = cause
        throw error //es para producir el error
    }
}

export default CustomError