import { cart, removeProductFromCart, updateProductQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatMoney } from "./utils/money.js";


let cartHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.id; // 🔹 Fixed: Use `id` instead of `productId`
  
  let matchedProduct = products.find((product) => product.id === productId);
  
  if (!matchedProduct) {
    console.error(`Product with ID ${productId} not found in products list.`);
    return; // Skip this cart item
  }

  cartHTML += `<div class="cart-item-container js-cart-item-container-${matchedProduct.id}">
  <div class="delivery-date">
    Delivery date: Wednesday, June 15
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

      <div class="delivery-option">
        <input type="radio" class="delivery-option-input" name="delivery-option-${matchedProduct.id}">
        <div>
          <div class="delivery-option-date">
            Tuesday, June 21
          </div>
          <div class="delivery-option-price">
            FREE Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio" checked class="delivery-option-input" name="delivery-option-${matchedProduct.id}">
        <div>
          <div class="delivery-option-date">
            Wednesday, June 15
          </div>
          <div class="delivery-option-price">
            $4.99 - Shipping
          </div>
        </div>
      </div>
      <div class="delivery-option">
        <input type="radio" class="delivery-option-input" name="delivery-option-${matchedProduct.id}">
        <div>
          <div class="delivery-option-date">
            Monday, June 13
          </div>
          <div class="delivery-option-price">
            $9.99 - Shipping
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
});

document.querySelector(".js-order-summary").innerHTML = cartHTML;

function updatcheckouteCartQuantity() {
let cartQuantity = 0;

cart.forEach((cartItem) => {
  cartQuantity += cartItem.quantity;
});

document.querySelector('.js-return-to-home-link')
  .innerHTML = `${cartQuantity} items`;
}
updatcheckouteCartQuantity();
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
    removeProductFromCart(productId); // 🔹 Fixed: No need for `Number()`
    updatcheckouteCartQuantity();
  });
});

// Update Quantity Functionality
document.querySelectorAll(".js-update-quantity").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    const quantityContainer = link.closest(".product-quantity");
    const quantityLabel = quantityContainer.querySelector(".quantity-label");
    const deleteButton = quantityContainer.querySelector(".js-delete-quantity");

    // Hide the update link
    link.style.display = "none";

    // Create input field for new quantity
    const newQuantity = document.createElement("input");
    newQuantity.type = "number";
    newQuantity.value = quantityLabel.textContent;
    newQuantity.classList.add("quantity-input");

    // Create Save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("update-quantity-save-button");

    // Move Delete button after the new input and save button
    quantityContainer.appendChild(newQuantity);
    quantityContainer.appendChild(saveButton);
    quantityContainer.appendChild(deleteButton);

    // Save Button Event Listener
    saveButton.addEventListener("click", () => {
      const updatedQuantity = parseInt(newQuantity.value, 10);
      if (updatedQuantity > 0) {
        updateProductQuantity(productId, updatedQuantity);
        quantityLabel.textContent = updatedQuantity;
      }

      // Remove input and button after update
      newQuantity.remove();
      saveButton.remove();

      // Show the update link again
      link.style.display = "inline";
    });
  });
});


