import { cart, removeProductFromCart, updateProductQuantity, clearCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatMoney } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
// import { storeOrder } from "./orders.js";

let cartHTML = "";

if (cart.length === 0) {
  cartHTML = `<div class="cart-empty-message">
   <p>
   Your cart is empty.
   </p>
    <a href="index.html" class="link-primary"><button class="button-primary js-return-to-home-link"> Return to Home</button></a>
  </div>`;
  let but = document.querySelector(".js-order-place-button");
  but.style.opacity = 0.5;
  but.disabled = true;
  
}
export let finaltotal = 0;

cart.forEach((cartItem) => {
  const productId = cartItem.id;
  
  let matchedProduct = products.find((product) => product.id === productId);
  
  if (!matchedProduct) {
    console.error(`Product with ID ${productId} not found in products list.`);
    return;
  }

  if (!cartItem.deliveryOptionId) {
    cartItem.deliveryOptionId = 1;
  }

  // Get selected delivery option for this item
  let selectedOption = deliveryOptions.find(option => option.id === cartItem.deliveryOptionId);
  let deliveryDate = selectedOption
    ? dayjs().add(selectedOption.deliverydays, "day").format("dddd, MMMM D")
    : (selectedOption="1" && (dayjs().add(1, "day").format("dddd, MMMM D")));

  cartHTML += `<div class="cart-item-container js-cart-item-container-${matchedProduct.id}">
    <div class="delivery-date">
      Delivery date: ${deliveryDate}
    </div>

    <div class="cart-item-details-grid">
      <img class="product-image" src="${matchedProduct.image}">

      <div class="cart-item-details">
        <div class="product-name">
          ${matchedProduct.name}
        </div>
        <div class="product-price">
          $${formatMoney(matchedProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
          </span>
          <span class="update-quantity-link link-primary js-update-quantity" data-product-id="${matchedProduct.id}">
            Update
          </span>
          <span class="delete-quantity-link link-primary js-delete-quantity" data-product-id="${matchedProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        ${deliveryOptionsHTML(matchedProduct.id, cartItem.deliveryOptionId="1")}
      </div>
    </div>
  </div>`;
});

document.querySelector(".js-order-summary").innerHTML = cartHTML;
updatePrice();
// Function to generate delivery options dynamically
function deliveryOptionsHTML(productId, selectedOptionId) {
  return deliveryOptions.map((option) => {
    let deliveryDate = dayjs().add(option.deliverydays, "day").format("dddd, MMMM D");
    let price = option.priceCents === 0 ? "FREE Shipping" : `$${formatMoney(option.priceCents)} - Shipping`;

    return `<div class="delivery-option">
      <input type="radio" class="delivery-option-input js-delivery-option" 
        name="delivery-option-${productId}" 
        data-product-id="${productId}" 
        data-option-id="${option.id}"
        ${option.id === selectedOptionId ? "checked" : ""}>
      <div>
        <div class="delivery-option-date">
          ${deliveryDate}
        </div>
        <div class="delivery-option-price">
          ${price}
        </div>
      </div>
    </div>`;
  }).join("");
}

// In the order placement click handler:
document.querySelector(".js-order-place-button").addEventListener("click", () => {
  if (cart.length === 0) return;

  let orderData = {
    items: cart.map(cartItem => {
      const product = products.find(p => p.id === cartItem.id) || {};
      return {
        id: cartItem.id,
        quantity: cartItem.quantity,
        name: product.name,
        image: product.image,
        priceCents: product.priceCents,
        deliveryOptionId: cartItem.deliveryOptionId || "1"
      };
    }),
    total: finaltotal,
    date: dayjs().format("MMMM D, YYYY"),
    orderId: `ORD-${Math.floor(Math.random() * 1000000)}`
  };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(orderData);
  localStorage.setItem("orders", JSON.stringify(orders));

  clearCart(); // Use the imported function instead of manual clearing
  window.location.href = "orders.html";
});



// Update delivery date when an option is selected
document.body.addEventListener("change", (event) => {
  if (event.target.classList.contains("js-delivery-option")) {
    const productId = event.target.dataset.productId;
    const selectedOptionId = event.target.dataset.optionId; 

    let cartItem = cart.find((item) => item.id === productId);
    if (cartItem) {
      cartItem.deliveryOptionId = selectedOptionId;
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Update UI for delivery date
    const selectedOption = deliveryOptions.find((option) => option.id === selectedOptionId);
    if (selectedOption) {
      const newDeliveryDate = dayjs().add(selectedOption.deliverydays, "day").format("dddd, MMMM D");
      document.querySelector(`.js-cart-item-container-${productId} .delivery-date`).textContent = `Delivery date: ${newDeliveryDate}`;
    }

    updatePrice(); // ✅ Fix 2: Update total price when shipping option changes
  }
});


// Function to update cart quantity in the UI
function updateCheckoutCartQuantity() {
  let cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
}
updateCheckoutCartQuantity();

// Delete Functionality
document.querySelectorAll(".js-delete-quantity").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    console.log(`Removing product ID: ${productId}`);

    // Remove item from the UI
    const cartItemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
    if (cartItemContainer) {
      cartItemContainer.remove();
    }

    // Remove product from cart
    removeProductFromCart(productId);
    updatePrice(); // 🔥 Update the price dynamically
    updateCheckoutCartQuantity();
  });
});

// Update Quantity Functionality
document.querySelectorAll(".js-update-quantity").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    const quantityContainer = link.closest(".product-quantity");
    const quantityLabel = quantityContainer.querySelector(".quantity-label");

    link.style.display = "none";

    const newQuantity = document.createElement("input");
    newQuantity.type = "number";
    newQuantity.value = quantityLabel.textContent;
    newQuantity.classList.add("quantity-input");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("update-quantity-save-button");

    quantityContainer.appendChild(newQuantity);
    quantityContainer.appendChild(saveButton);

    saveButton.addEventListener("click", () => {
      const updatedQuantity = parseInt(newQuantity.value, 10);
      if (updatedQuantity > 0) {
        updateProductQuantity(productId, updatedQuantity);
        quantityLabel.textContent = updatedQuantity;
        updatePrice(); // 🔥 Update the price dynamically
        updateCheckoutCartQuantity();
      }
    
      newQuantity.remove();
      saveButton.remove();
      link.style.display = "inline";
    });
  });
});

//updatepriceaccoprding to quantity


function updatePrice() {
  let itemTotal = 0, shippingCost = 0, taxRate = 0.10;

  cart.forEach(cartItem => {
    let matchedProduct = products.find(product => product.id === cartItem.id);
    let selectedOption = deliveryOptions.find(option => option.id === cartItem.deliveryOptionId);
    if (matchedProduct && selectedOption) {
      itemTotal += matchedProduct.priceCents * cartItem.quantity;
      shippingCost += selectedOption.priceCents;
    }
  });

  let totalBeforeTax = itemTotal + shippingCost;
  let estimatedTax = totalBeforeTax * taxRate;
  let orderTotal = totalBeforeTax + estimatedTax;

  


  // Update the UI
  document.querySelector(".js-cart-quantity").textContent = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector(".js-items-total").textContent = `$${formatMoney(itemTotal)}`;
  document.querySelector(".js-shipping-handling").textContent = `$${formatMoney(shippingCost)}`;
  document.querySelector(".js-total-before-tax").textContent = `$${formatMoney(totalBeforeTax)}`;
  document.querySelector(".js-estimated-tax").textContent = `$${formatMoney(estimatedTax)}`;
  document.querySelector(".js-order-total").textContent = `$${formatMoney(orderTotal)}`;
  document.querySelector(".js-order-total").textContent = `$${formatMoney(orderTotal)}`;
  console.log(orderTotal);
  finaltotal = orderTotal;
}


// Function to store orders
// document.querySelector(".js-order-place-button").addEventListener("click", () => {
//   storeOrder();
//   clearCart();
//   window.location.href = "index.html";
// });
