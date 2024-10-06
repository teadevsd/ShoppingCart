    // ADD TO CART
    const addToCartButtons = document.querySelectorAll('.addToCartBtn');
    for (let i = 0; i < addToCartButtons.length; i++) {
        addToCartButtons[i].addEventListener('click', handleAddToCart);
    }

    // REMOVE CART BUTTON
    const removeCartButtons = document.querySelectorAll('.deleteIcon');
    for (let i = 0; i < removeCartButtons.length; i++) {
        removeCartButtons[i].addEventListener('click', removeCartItem);
    }

    // INCREMENT & DECREMENT FUNCTION
    const qualityIncrementButtons = document.querySelectorAll('.qualityButton .increment');
    const qualityDecrementButtons = document.querySelectorAll('.qualityButton .decrement');
    for (let i = 0; i < qualityIncrementButtons.length; i++) {
        qualityIncrementButtons[i].addEventListener('click', handleProductIncrement);
    }
    for (let i = 0; i < qualityDecrementButtons.length; i++) {
        qualityDecrementButtons[i].addEventListener('click', handleProductDecrement);
    }

    document.querySelector('.confirm-order').addEventListener('click', showOrderConfirmation);

    updateCartVisibility();



function handleProductIncrement(event) {
    const button = event.target;
    const qualityButton = button.parentElement;
    const quantityElement = qualityButton.querySelector('.quantity');
    let quantity = parseInt(quantityElement.textContent);
    quantity++;
    quantityElement.textContent = `${quantity}`;
    updateQuantityInCart(qualityButton, quantity);
    updateCartTotals(); 
}



function handleProductDecrement(event) {
    const button = event.target;
    const qualityButton = button.parentElement;
    const quantityElement = qualityButton.querySelector('.quantity');
    let quantity = parseInt(quantityElement.textContent);
    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = `${quantity}`;
        updateQuantityInCart(qualityButton, quantity);
        updateCartTotals(); 
    }
}



function handleAddToCart(event) {
    const button = event.target.closest('.addToCartBtn');
    const productItem = button.closest('.cart-Items');
    const qualityButton = productItem.querySelector('.qualityButton');

    const selectedQuantityText = qualityButton.querySelector('.quantity').textContent;
    const selectedQuantity = parseInt(selectedQuantityText);
    const title = productItem.querySelector('.cart-items-details p:first-child').textContent;
    const price = parseFloat(productItem.querySelector('.cart-items-details p:nth-child(3)').textContent.replace('$', '').trim());

    qualityButton.style.display = 'block';
    const cartItems = document.querySelectorAll('.cart-item');
    let itemExists = false;

    for (let i = 0; i < cartItems.length; i++) {
        let existingCartItem = cartItems[i];
        let itemName = existingCartItem.querySelector('h3').textContent;

        if (itemName === title) {
            let quantityElement = existingCartItem.querySelector('.quantityXXX');
            let quantity = parseInt(quantityElement.textContent);
            quantity += selectedQuantity;
            quantityElement.textContent = `${quantity}x`;
            const totalPriceElement = existingCartItem.querySelector('.total-price');
            totalPriceElement.textContent = `$${(quantity * price).toFixed(2)}`;
            itemExists = true;
            break;
        }
    }

    if (!itemExists) {
        addNewItemToCart(title, price, selectedQuantity);
    }

    updateCartCounts();
    updateCartVisibility();
    updateCartTotals();

    
    document.querySelector('.delivery').style.display = 'block';
    document.querySelector('.order-summary').style.display = 'block';

    updateCartVisibility();

    qualityButton.querySelector('.quantity').textContent = '1';
}



function addNewItemToCart(title, price, quantity = 1) {
    const cartListContents = document.querySelector('.cartListContents');
    const cartItemHTML = `
        <div class="cart-item">
            <h3>${title}</h3>
            <div class="cart-list-details">
                <p class="quantityXXX">${quantity}x</p>
                <p class="quantity-price">@ $${price.toFixed(2)}</p>
                <p class="total-price">$${(price * quantity).toFixed(2)}</p>
                <img class="deleteIcon" src="./assets/images/icon-remove-item.svg" alt="Remove item">
            </div>
            <hr>
        </div>`;
    cartListContents.insertAdjacentHTML('beforeend', cartItemHTML);
    
    const deleteButtons = document.querySelectorAll('.deleteIcon');
    let newDeleteButton = deleteButtons[deleteButtons.length - 1];
    newDeleteButton.addEventListener('click', removeCartItem);
}



function updateQuantityInCart(qualityButton, quantity) {
    const productItem = qualityButton.closest('.cart-Items');
    const title = productItem.querySelector('.cart-items-details p:first-child').textContent;
    const cartItems = document.querySelectorAll('.cart-item');

    for (let i = 0; i < cartItems.length; i++) {
        let existingCartItem = cartItems[i];
        if (existingCartItem.querySelector('h3').textContent === title) {
            const quantityElement = existingCartItem.querySelector('.quantityXXX');
            quantityElement.textContent = `${quantity}x`;
            const priceText = existingCartItem.querySelector('.quantity-price').textContent.replace('@ $', '');
            const price = parseFloat(priceText);
            const totalPriceElement = existingCartItem.querySelector('.total-price');
            totalPriceElement.textContent = `$${(quantity * price).toFixed(2)}`;
            updateCartCounts();
            break;
        }
    }
}



function removeCartItem(event) {
    const button = event.target;
    const productItem = button.closest('.cart-item'); 
    productItem.remove();
    updateCartCounts(); 
    updateCartVisibility();
    updateCartTotals(); 
    
    const cartItemTitle = productItem.querySelector('h3').textContent;
    const cartItemsContainers = document.querySelectorAll('.cart-Items');

    cartItemsContainers.forEach((container) => {
        const containerTitle = container.querySelector('.cart-items-details p:first-child').textContent;

        if (containerTitle === cartItemTitle) {
            const qualityButton = container.querySelector('.qualityButton');
            const addToCartButton = container.querySelector('.addToCartBtn');
            
            if (qualityButton) {
                qualityButton.style.display = 'none';
            }
            if (addToCartButton) {
                addToCartButton.style.display = 'block';
            }
        }
    });

    const cartItems = document.querySelectorAll('.cart-item');
    if (cartItems.length === 0) {
        document.querySelector('.delivery').style.display = 'none';
        document.querySelector('.order-summary').style.display = 'none';
    }
}



function updateCartCounts() {
    const cartItems = document.querySelectorAll('.cart-item');
    let totalQuantity = 0;

    for (let i = 0; i < cartItems.length; i++) {
        const quantityText = cartItems[i].querySelector('.quantityXXX').textContent;
        const quantity = parseInt(quantityText);
        totalQuantity += quantity;
    }

    const cartHeader = document.getElementById('cartHeader');
    const cartHeader2 = document.getElementById('cartHeader2');
    if (cartHeader) {
        cartHeader.textContent = `Your cart (${totalQuantity})`;
    }
    if (cartHeader2) {
        cartHeader2.textContent = `Your cart (${totalQuantity})`;
    }
}



function updateCartVisibility() {
    const cartItems = document.querySelectorAll('.cart-item');
    const cartListContents = document.querySelector('.cartListContents');
    const emptyCart = document.querySelector('.emptyCart');
    const deliverySection = document.querySelector('.delivery');
    const orderSummarySection = document.querySelector('.order-summary');

    if (cartItems.length === 0) {
        emptyCart.style.display = 'block';
        cartListContents.style.display = 'none';
        deliverySection.style.display = 'none'; 
        orderSummarySection.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartListContents.style.display = 'block';
        deliverySection.style.display = 'block'; 
        orderSummarySection.style.display = 'block';
    }
}

function updateCartTotals() {
    const cartItems = document.querySelectorAll('.cart-item');
    let totalPrice = 0;

    for (let i = 0; i < cartItems.length; i++) {
        const quantityText = cartItems[i].querySelector('.quantityXXX').textContent;
        const quantity = parseInt(quantityText);
        const priceText = cartItems[i].querySelector('.quantity-price').textContent.replace('@ $', '');
        const price = parseFloat(priceText);

        totalPrice += price * quantity;
    }

    const orderTotalSpan = document.querySelector('.order-total span');
    if (orderTotalSpan) {
        orderTotalSpan.textContent = `$${totalPrice.toFixed(2)}`;
    }
}


function showOrderConfirmation() {
    const overlay = document.querySelector('.overlay');
    const confirmOrderContents = document.querySelector('.confirmorderContents');
    const cartItems = document.querySelectorAll('.cart-item');

    // Clear previous contents and set up confirmation message
    confirmOrderContents.innerHTML = `
        <img src="./assets/images/icon-order-confirmed.svg" alt="">
        <h2 id="cartHeader3">Order Confirmed</h2>
        <p>We hope you enjoy your food</p>
    `;

    // Populate order details and calculate total
    let totalPrice = 0;
    cartItems.forEach(item => {
        const itemName = item.querySelector('h3').textContent;
        const itemQuantity = item.querySelector('.quantityXXX').textContent;
        const itemPrice = item.querySelector('.quantity-price').textContent.replace('@ $', '');
        const itemTotalPrice = item.querySelector('.total-price').textContent;

        // Calculate the total price for confirmation
        const priceValue = parseFloat(itemTotalPrice.replace('$', ''));
        totalPrice += priceValue;

        const itemHTML = `
            <div class="cart-item">
                <h3>${itemName}</h3>
                <div class="cart-list-details">
                    <p class="quantityXXX">${itemQuantity}</p>
                    <p class="quantity-price">${itemPrice}</p>
                    <p class="total-price">${itemTotalPrice}</p>
                </div>
                <hr>
            </div>`;
        
        confirmOrderContents.insertAdjacentHTML('beforeend', itemHTML);
    });

    // Add total price to confirmation
    confirmOrderContents.innerHTML += `
        <div class="order-total">
            <strong>Order Total:</strong>
            <span>$${totalPrice.toFixed(2)}</span>
        </div>
    `;

    
    confirmOrderContents.style.display = 'block';
    overlay.style.display = 'flex'; 
}


document.addEventListener('click', function(event) {
    
    const overlay = document.querySelector('.overlay');
    const button = document.querySelector('.start-order');

    if (!overlay.contains(event.target) && !button.contains(event.target)) {
        return;
    }

    if (button.contains(event.target)) {
        location.reload();
    }
});



// Show the overlay and block interaction on the page when .confirm-order is clicked
document.querySelector('.confirm-order').addEventListener('click', function(e) {
    document.querySelector('.overlay').style.display = 'block'; 
    document.body.style.pointerEvents = 'none'; 
    document.querySelector('.start-order').style.pointerEvents = 'auto'; 
});



// Handle the start-order click and hide the overlay
document.querySelector('.start-order').addEventListener('click', function(e) {
    document.querySelector('.overlay').style.display = 'none'; 
    document.body.style.pointerEvents = 'auto'; 
});

