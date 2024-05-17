const generateProductErrorInfo = (products) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * title : needs to be a String, received ${products.title}
    * price : needs to be a Number, received ${products.price}
    * code  : needs to be a String, received ${products.code}
    * stock : needs to be a Number, received ${products.stock}`
}

export default generateProductErrorInfo
