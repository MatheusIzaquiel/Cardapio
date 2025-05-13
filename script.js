const menu = document.querySelector("#menu")
const cartBtn = document.querySelector("#cart-btn")
const cartModal = document.querySelector("#cart-modal")
const cartItemsContainer = document.querySelector("#cart-items")
const cartTotal = document.querySelector("#cart-total")
const checkoutBtn = document.querySelector("#checkout-btn")
const closeModalBtn = document.querySelector("#close-modal-btn")
const cartCounter = document.querySelector("#cart-count")
const addressInput = document.querySelector("#address")
const addressWarn = document.querySelector("#address-warn")

let cart = []

cartBtn.addEventListener("click", () => {
    updateCartModal()
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click", (event) => {
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = "none"
})

menu.addEventListener("click", (event) => {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }
})

//FUNÇÃO PARA ADICIONAR NO CARRINHO
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1
    } else{
      cart.push({
        name,
        price,
        quantity: 1,
    })  
    }

    updateCartModal()
}

//ATUALIZAR CARRINHO
function updateCartModal(){
    cartItemsContainer.innerHTML = ""
    let total = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")

        cartItemElement.classList.add("cart-item")

        cartItemElement.innerHTML = `
            <div class="cart-item-content">
                <div class="cart-item-info">
                    <p>${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p>R$ ${item.price.toFixed(2)}</p>
                </div>

                <div class="cart-item-actions">
                    <button class="remove-item-btn" data-name="${item.name}">
                        Remover
                    </button>
                </div>
            </div>
        `
        total += item.price * item.quantity

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length
}

//REMOVER ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", (event) =>{
    if(event.target.classList.contains("remove-item-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index]
        
        if(item.quantity > 1){
            item.quantity -= 1
            updateCartModal()
            return
        }

        cart.splice(index, 1)
        updateCartModal()
    }
}

//PEGAR ENDEREÇO DIGITADO
addressInput.addEventListener("input", (event) => {
    let inputValue = event.target.value

    if(inputValue !== ""){
        addressWarn.style.display = "none"
    }
})

checkoutBtn.addEventListener("click", () => {
    const isOpen = checkRestaurantOpen()
    if(!isOpen){
       Toastify({
        text: "O restaurante está fechado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "rigth", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#ef4444",
        }
        }).showToast()

        return
    }

    if(cart.length === 0) return

    if(addressInput.value === ""){
        addressWarn.style.display = "flex"
        return
    }

    //enviar para o whats
    const cartItems = cart.map((item) =>{
        return(
           ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} ` 
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "+5521998700595"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart = []
    updateCartModal()
})

//VERIFICA HORA DO RESTAURANTE
function checkRestaurantOpen(){
    const data = new Date
    const hora = data.getHours()
    return hora >= 18 && hora < 22
}

const spanItem = document.querySelector("#date-span")
const isOpen = checkRestaurantOpen()

if(isOpen){
    spanItem.style.backgroundColor = "rgba(15, 155, 15, 0.911)"
} else {
    spanItem.style.backgroundColor = "rgb(199, 30, 30)"
}
