import Swal from "sweetalert2";


const CartContext = createContext({
    cart: [],
    addItem: () => { },
    removeItem: () => { },
    isInCart: () => { },
    clearCart: () => { },
    totalQuantity: 0,
    total: 0
})

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])

    const addItem = (item, quantity) => {
        if (!isInCart(item.id)) {
            setCart(prev => [...prev, { ...item, quantity }])
        } else {
            //Notificación en caso de que el producto seleccionado ya esté agregado en el carrito
            Swal.fire({
                icon: "error",
                title: "Oops... Algo anda mal",
                text: "Parece que el producto ya está agregado",
            });
        }
    }

    const isInCart = (itemId) => {
        return cart.some(prod => prod.id === itemId)
    }

    const removeItem = (itemId) => {
        const cartUpdated = cart.filter(prod => prod.id !== itemId)
        setCart(cartUpdated)
    }

    const clearCart = () => {
        setCart([])
    }

    const getTotalQuantity = () => {
        let totalQuantity = 0

        cart.forEach(prod => {
            totalQuantity += prod.quantity
        })

        return totalQuantity
    }

    const totalQuantity = getTotalQuantity()

    const getTotal = () => {
        let total = 0

        cart.forEach(prod => {
            total += prod.price * prod.quantity
        })

        return total
    }

    const total = getTotal()

    return (
        <CartContext.Provider value={{ cart, addItem, isInCart, removeItem, clearCart, totalQuantity, total }}>
            {children}
        </CartContext.Provider>
    )
}

// Para usar en cart.handlebars
export const Cart = () => {
    const { cart, clearCart, removeItem, totalQuantity, total } = useCart()

    const showRemoveConfirmation = (productId) => {
        //función necesaria para poder implementar SweetAlert en el código al momento de eliminar un producto del carrito
        Swal.fire({
            title: '¿Estás seguro qué deseas eliminar este producto?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, estoy seguro',
        }).then((result) => {
            if (result.isConfirmed) {
                // Ejecuta la lógica para eliminar el producto
                removeItem(productId);
            }
        });
    };

    if(totalQuantity === 0) {
        return (
            <div className="carritoVacio">
                <h2>No hay items en el carrito</h2>
                <Link to="/" className="cartLinkProductos">Página principal</Link>
            </div>
        )
    } else {
        return (
            <div className="carritoConProductos">
                <h2 className="tituloPrincipalPrecioUnitario">Detalle del pedido</h2>
                {
                    cart.map(prod => {
                        return (
                            <div key={prod.id} className="productContainer">
                                <h3 className="tituloPrincipalPrecioUnitario">{prod.quantity} unidades de {prod.name} juego físico</h3>
                                <h4 className="tituloPrecioUnitario">Precio unitario ${prod.price}</h4>
                                <img src={prod.img} className="imagenProductoEncarrito" />
                                <button onClick={() => showRemoveConfirmation(prod.id)} className="botonEliminarDelCarrito">
                                    <img src={eliminar} className="imagenCestoBasura" alt="cesto de basura" />
                                </button>
                            </div>
                        )
                    })
                }
                <h3>Total: ${total}</h3>
                <button onClick={() => clearCart()} className="definirLaClase">Limpiar carrito</button>
                <Link to="/checkout" className="definirLaClase">Checkout</Link>
            </div>
        )
    }
}