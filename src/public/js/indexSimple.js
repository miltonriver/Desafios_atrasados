/* 
 * =======================================================
 * NOTA IMPORTANTE:
 * Por razones funcionales, se ha agregado el script 
 * 'indexSimple.js' en un archivo separado. El problema 
 * surgió al crecer el código y el scrip original que  
 * se encontraba en el archivo index.js en está misma  
 * ubicación dejó de funcionar
 * =======================================================
 */

const socket = io();
console.log('Cliente conectado al servidor de socket')

socket.emit('message1', 'Me estoy comunicando desde un websocket!!')

// document.addEventListener("DOMContentLoaded", () => {
//     const pass = document.getElementById("pass");
//     const icon = document.querySelector(".bx");

//     if (pass && icon) {
//         icon.addEventListener("click", e => {
//             if (pass.type === "password") {
//                 pass.type = "text";
//                 icon.classList.remove('bx-show');
//                 icon.classList.add('bxs-hide');
//             } else {
//                 pass.type = "password";
//                 icon.classList.add('bx-show');
//                 icon.classList.remove('bxs-hide');
//             }
//         });
//     } else {
//         console.error("Elements not found");
//     }
// });

function redirectToLogin() {
    window.location.href = "/login";
}

socket.on('error', (errorMessage) => {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
    });
})

function addProduct() {

    let title       = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let price       = document.getElementById("price").value;
    let thumbnail   = document.getElementById("thumbnail").value;
    let code        = document.getElementById("code").value;
    let stock       = document.getElementById("stock").value;
    let status      = document.getElementById("status").value;
    let category    = document.getElementById("category").value;

    const product = { title, description, price, thumbnail, code, stock, status, category }

    socket.emit("addProduct", product);
    document.getElementById("form_add").reset();
}

function deleteProduct(productId) {
    socket.emit("deleteProduct", { _id: productId });
}

// function updateProduct(pid) {

//     let title       = document.querySelector(`#modal_title_${pid}`).value.trim();
//     let description = document.querySelector(`#modal_description_${pid}`).value.trim();
//     let price       = document.querySelector(`#modal_price_${pid}`).value.trim();
//     let thumbnail   = document.querySelector(`#modal_thumbnail_${pid}`).value.trim();
//     let code        = document.querySelector(`#modal_code_${pid}`).value.trim();
//     let stock       = document.querySelector(`#modal_stock_${pid}`).value.trim();
//     let status      = document.querySelector(`#modal_status_${pid}`).value.trim();
//     let category    = document.querySelector(`#modal_category_${pid}`).value.trim();

//     const product = { title, description, price, thumbnail, code, stock, status, category, _id: pid }

//     console.log('Producto actualizado:', product)
//     socket.emit("updateProduct", product)
// }

socket.on('productsList', (productList) => {
    const adminProductListContainer = document.getElementById('adminProductList');
    const userProductListContainer = document.getElementById('userProductList');

    const productHtml = productList.map(product => `
        <div>
            <li>
                Nombre: <b>${product.title}</b>
                <p><b>Descripción:</b> ${product.description}</p>
                <p>Precio: <b>$ ${product.price}</b></p>
                <p>Código: <b>${product.code}</b></p>
                <p>Stock: <b>${product.stock}</b></p>
                <p>Id: <b>${product._id}</b></p>
                <button type="button" class="delete_button" onclick='deleteProduct("${product._id}")'>Eliminar</button>
                <button type="button" class="add_button modal_add_button" id="open_modal_update_product_${product._id}}">Actualizar</button>
                <dialog id="modal_${product._id}" class="modal">
                    <form class="form_modal" method="POST">
                        <label for="product" class="field_modal_form">Nombre del producto</label>
                        <input type="text" name="product" placeholder="Ingrese el nombre del producto" class="input_modal_form">
                        <label for="description" class="field_modal_form">Descripción</label>
                        <input type="text" name="description" placeholder="Ingrese la descripción del producto" class="input_modal_form">
                        <label for="price" class="field_modal_form">Precio</label>
                        <input type="text" name="price" placeholder="Ingrese el precio del producto" class="input_modal_form">
                        <label for="thumbnail" class="field_modal_form">Imagen</label>
                        <input type="text" name="thumbnail" placeholder="Ingrese una imagen descriptiva" class="input_modal_form">
                        <label for="code" class="field_modal_form">Código</label>
                        <input type="text" name="code" placeholder="Ingrese el código del producto" class="input_modal_form">
                        <label for="stock" class="field_modal_form">Stock</label>
                        <input type="text" name="stock" placeholder="Ingrese un número para el stock" class="input_modal_form">
                        <label for="status" class="field_modal_form">Status</label>
                        <input type="text" name="status" placeholder="Ingrese el status del producto" class="input_modal_form">
                        <label for="category" class="field_modal_form">Categoría</label>
                        <input type="text" name="category" placeholder="Ingrese la categoría del producto" class="input_modal_form">
                    </form>
                    <button type="button" class="delete_button" onclick="closeModal('${product._id}')">Cerrar</button>
                </dialog>
            </li>
        </div>
    `).join('');

    if (adminProductListContainer) {
        adminProductListContainer.innerHTML = productHtml;
    }

    if (userProductListContainer) {
        userProductListContainer.innerHTML = productHtml;
    }
});

Swal.fire({
    title: "Autentificación requerida para poder ingresar",
    input: "text",
    text: "Ingresa tu nombre de usuario registrado",
    inputValidator: value => {
        return !value && "Necesitas ingresar un nombre de usuario válido para poder continuar"
    },
    allowOutsideClick: false
}).then(async (result) => {
    const username = result.value;
    const response = await fetch(`/api/users/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    });

    const data = await response.json();

    if (data.status === 'success') {
        startChat(username);
    } else {
        Swal.fire({
            title: "Error",
            text: data.message,
            icon: "error",
            confirmButtonText: "Ok"
        });
    }
});

function startChat(username) {
    const chatbox = document.querySelector('#chatbox');
    chatbox.addEventListener('keyup', (evt) => {
        if (evt.key === 'Enter') {
            if (chatbox.value.trim().length > 0) {
                socket.emit('message', { username, message: chatbox.value });
                chatbox.value = '';
            }
        }
    });

    socket.on('messageLogs', data => {
        let messageLogs = document.querySelector('#messageLogs');
        let mensajes = '';
        data.forEach(mensaje => {
            mensajes += `<li>${mensaje.username} dice: ${mensaje.message}</li>`;
        });
        messageLogs.innerHTML = mensajes;
        console.log(mensajes);
    });
}

function getToken() {
    return sessionStorage.getItem('token');
}

function getDecodedToken() {
    const token = getToken()
    if (!token) {
        console.error('Token not found')
        return null
    }

    try {
        const decoded = jwt_decode(token)
        return decoded
    } catch (error) {
        console.error('Error decoding token:', error)
        return null
    }
}

function addProductToCart(productId, quantity = 1) {
    const token = getToken()
    const cartId = sessionStorage.getItem('cartId')
    if (!token || !cartId) {
        console.error('Token o cartId no encontrados')
        Swal.fire({
            title: 'Error!',
            text:  `Error, no se pudo agregar el producto al carrito`,
            icon:  'error'
        })
        return;
    }

    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.status === "success") {
                Swal.fire({
                    title: 'Producto agregado!!',
                    text:  `${quantity} productos han sido agregado al carrito de forma exitosa`,
                    icon:  'success'
                }).then(() => {
                    window.location.reload()
                })                
            } else {
                Swal.fire({
                    title: 'Error!',
                    text:  `Error al agregar el producto al carrito: ${data.message}`,
                    icon:  'error'
                })
            }
        })
        .catch(error => {
            console.error('Error:', error)
        })
}