let iconCart = document.querySelector('.icon-cart');
let body = document.querySelector('body');
let close = document.querySelector('.close');
let listProductHTML = document.querySelector('.list-product');
let listCartHTML = document.querySelector('.list-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let minus = document.querySelector('.minus');
let plus = document.querySelector('.plus');

let listProduct = [];
let carts = [];


iconCart.addEventListener("click", () => {
    body.classList.toggle('show-cart');
});
close.addEventListener("click", ()=> {
    body.classList.toggle('show-cart');
})
listCartHTML.addEventListener("click", (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        type = 'minus';
        if(positionClick.classList.contains('plus')) {
            type = 'plus';
        }
        changeQuantity(product_id, type);
    }
})

const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0) {
        switch(type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;
            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if(valueChange > 0) {
                    carts[positionItemInCart].quantity = valueChange;
                } else {
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
        addCartToMemory();
        addCartToHTML(); //To refresh data on the screen
    }
   
}

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if(listProduct.length > 0) {
        listProduct.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">${product.price}</div>
                <button class="addCart">
                    Add To Cart
                </button>
            `;
            listProductHTML.appendChild(newProduct);
        })
    }

}

listProductHTML.addEventListener("click", (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains("addCart")) {
        let productId = positionClick.parentElement.dataset.id;
        addToCart(productId);
    }
})

const addToCart = (productId) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == productId);
    if(carts.length <= 0) {
        carts = [{
            product_id: productId,
            quantity: 1
        }]
    }
    else if(positionThisProductInCart < 0) {
        carts.push({
            product_id: productId,
            quantity: 1
        });
    }
    else {
        carts[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0) {
        carts.forEach((cart) => {
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProduct.findIndex((value) => cart.id == value.product_id);
            let info = listProduct[positionProduct];

            newCart.innerHTML = `
                <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">${info.name}</div>
                <div class="total-price">
                    ${info.price * cart.quantity}$
                </div>
                <div class="quantity">
                <span class="minus"></span>
                <span>${cart.quantity}</span>
                <span class="plus"></span>
                </div>
            `;
                listCartHTML.appendChild(newCart);
            })
        }
        iconCartSpan.innerText = `${totalQuantity}`;
}

const initApp = () => {
    fetch('./products.json')
    .then(response => response.json())
    .then(data => {
        listProduct = data;
        addDataToHTML();
        if(localStorage.getItem('cart')) {
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }

    });
}
initApp();
