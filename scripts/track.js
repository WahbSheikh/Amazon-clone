import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { products } from "../data/products.js";

document.addEventListener("DOMContentLoaded", () => {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get("orderId");
  const cartItemId = urlParams.get("cartItemId");

  // Validate parameters
  if (!orderId || !cartItemId) {
    showTrackingError("Missing tracking information. Please use the track package button from your orders page.");
    return;
  }

  // Retrieve orders from localStorage
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const order = orders.find(order => order.orderId === orderId);

  if (!order) {
    showTrackingError("Order not found. It may have been cancelled or removed.");
    return;
  }

  const orderItem = order.items.find(item => item.id === cartItemId);
  if (!orderItem) {
    showTrackingError("Product not found in this order.");
    return;
  }

  // Get complete product data from both order and products list
  const productFromCatalog = products.find(p => p.id === cartItemId) || {};
  const product = {
    ...productFromCatalog,
    ...orderItem  // Order item data overrides catalog data
  };

  // Debug logging (remove in production)
  console.log("Tracking product:", product);
  console.log("Order date:", order.date);

  // Calculate dates and status
  const orderTime = dayjs(order.date, "MMMM D, YYYY");
  if (!orderTime.isValid()) {
    console.error("Invalid order date format:", order.date);
    showTrackingError("Invalid order data. Please contact support.");
    return;
  }

  const estimatedDeliveryTime = orderTime.add(2, "day");
  const currentTime = dayjs();

  let progressPercent;
  let status;

  if (currentTime.isBefore(orderTime.add(1, "day"))) {
    progressPercent = 30;
    status = "Preparing";
  } else if (currentTime.isBefore(estimatedDeliveryTime)) {
    progressPercent = 70;
    status = "Shipped";
  } else {
    progressPercent = 100;
    status = "Delivered";
  }

  // Update UI elements
  try {
    // Update delivery date
    document.querySelector(".delivery-date").textContent = 
      `Arriving on ${estimatedDeliveryTime.format("dddd, MMMM D")}`;
    
    // Update product info - fallback to catalog data if missing in order
    document.querySelector(".product-info").textContent = 
      product.name || "Product information not available";
    
    // Update quantity - always from order data
    document.querySelector(".product-quantity").textContent = 
      `Quantity: ${orderItem.quantity}`;
    
    // Update product image - try order image first, then catalog image
    const imgElement = document.querySelector(".product-image");
    const imageSrc = product.image || productFromCatalog.image;
    if (imageSrc) {
      imgElement.src = imageSrc;
      imgElement.alt = product.name || "Product image";
      imgElement.style.display = "block";
    } else {
      imgElement.style.display = "none";
    }

    // Update progress bar
    document.querySelector(".progress-bar").style.width = `${progressPercent}%`;

    // Update status labels
    document.querySelectorAll(".progress-label").forEach(label => {
      label.classList.remove("current-status");
      if (label.textContent === status) {
        label.classList.add("current-status");
      }
    });

  } catch (error) {
    console.error("Error updating tracking UI:", error);
    showTrackingError("Could not display tracking information. Please try again later.");
  }
});

function showTrackingError(message) {
  document.querySelector(".order-tracking").innerHTML = `
    <div class="error-message">
      <p>${message}</p>
      <a href="orders.html" class="link-primary">Back to orders</a>
    </div>
  `;
}