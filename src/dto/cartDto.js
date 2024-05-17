class CartDto {
    constructor(cart){
        this.products = cart.products.map(product => ({
            productId: product.product._id,
            quantity: product.quantity
        }));
    }
}

export default CartDto