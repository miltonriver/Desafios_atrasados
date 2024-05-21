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

document.addEventListener("DOMContentLoaded", () => {
    const pass = document.getElementById("pass");
    const icon = document.querySelector(".bx");

    if (pass && icon) {
        icon.addEventListener("click", e => {
            if (pass.type === "password") {
                pass.type = "text";
                icon.classList.remove('bx-show');
                icon.classList.add('bxs-hide');
            } else {
                pass.type = "password";
                icon.classList.add('bx-show');
                icon.classList.remove('bxs-hide');
            }
        });
    } else {
        console.error("Elements not found");
    }
});
