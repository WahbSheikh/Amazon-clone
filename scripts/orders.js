import { products } from "../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { addProductToCart } from "../data/cart.js";
import { formatMoney } from "./utils/money.js";

let orders = JSON.parse(localStorage.getItem("orders")) || [];
document.querySelector(".js-order-cart-quan").textContent = orders.length;
let orderHTML = "";

if (orders.length === 0) {
  orderHTML = `
    <div class="order-empty-message">
      <p>You have no orders.</p>
      <a href="amazon.html" class="link-primary">
        <button class="button-primary">Return to Home</button>
      </a>
    </div>`;
} else {
  orders.forEach((order) => {
    const orderDate = dayjs(order.date);
    
    orderHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderDate.format("MMMM D, YYYY")}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatMoney(order.total)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.orderId}</div>
          </div>
        </div>`;

    order.items.forEach((cartItem) => {
      let matchedProduct = products.find((product) => product.id === cartItem.id);
      if (!matchedProduct) return;

      const deliveryDate = orderDate.add(2, "day").format("dddd, MMMM D");
      
      orderHTML += `
        <div class="order-details-grid">
          <div class="product-image-container">
            <img src="${matchedProduct.image}">
          </div>
          <div class="product-details">
            <div class="product-name" data-product-id="${matchedProduct.id}">${matchedProduct.name}</div>
            <div class="product-delivery-date">Arriving on: ${deliveryDate}</div>
            <div class="product-quantity">Quantity: ${cartItem.quantity}</div>
            <button class="buy-again-button button-primary">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>
          <div class="product-actions">
            <a href="tracking.html?orderId=${order.orderId}&cartItemId=${cartItem.id}">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        </div>`;
    });

    orderHTML += `</div>`;
  });
}

document.querySelector(".js-order-list").innerHTML = orderHTML;

// Add event listeners after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".buy-again-button").forEach(button => {
    button.addEventListener("click", (event) => {
      const orderItem = event.target.closest(".order-details-grid");
      if (!orderItem) return;
      
      const productId = orderItem.querySelector(".product-name").dataset.productId;
      const quantityText = orderItem.querySelector(".product-quantity").textContent;
      const quantity = parseInt(quantityText.replace("Quantity: ", "")) || 1;
      
      addProductToCart(productId, quantity);
      
      // Visual feedback
      const buttonText = button.querySelector(".buy-again-message");
      const originalText = buttonText.textContent;
      buttonText.textContent = "Added to Cart!";
      setTimeout(() => {
        buttonText.textContent = originalText;
      }, 2000);
    });
  });
});