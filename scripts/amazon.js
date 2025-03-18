import { cart ,addProductToCart} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatMoney } from "./utils/money.js";
//we have imported the cart array from the cart.js file so that we can use it in this file
//rules for importing and exporting modules
//1. The module that exports the data should have an export statement
//2. The module that imports the data should have an import statement
//3. The import statement should be at the top of the file
//4. The import statement should be in curly braces if the module exports multiple items
//5. The import statement should be without curly braces if the module exports a single item
//6. The import statement should have the same name as the exported item
//7.we can open it using live server by right clicking on the file and selecting open with live server
let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity")) || 0;
document.querySelector(".js-cart-quantity").textContent = cartQuantity;

let ProductsHTML = "";
products.forEach((product) => {
  ProductsHTML += `
  <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
              src="${product[`image`]}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product[`name`]}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-${product.rating.stars * 10}.png">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            $${formatMoney(product.priceCents)}
          </div>

          <div class="product-quantity-container">
            <select>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
  `;
});
document.querySelector(".js-products-grid").innerHTML = ProductsHTML;

// Call this function to update cart quantity when page loads
updateCartQuantity();



function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  // Save cartQuantity to localStorage
  localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));

  document.querySelector(".js-cart-quantity").textContent = cartQuantity;
}


document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.getAttribute("data-product-id");
    //we could also use the following code to get the product name
    //const productName = button.dataset.productName;
    const checkmark = button.closest(".product-container").querySelector(".added-to-cart");
    checkmark.style.opacity = "1"; // Show the checkmark
    setTimeout(() => {
      checkmark.style.opacity = "0"; // Hide it after 2 seconds
    }, 2000);    
    const quantitySelector = button.closest(".product-container").querySelector("select");
    let quan = Number(quantitySelector.value);
    addProductToCart(productId,quan);
    updateCartQuantity();

  });
});
