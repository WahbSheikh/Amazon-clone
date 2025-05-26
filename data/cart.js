export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addProductToCart(productId, quantity = 1) {
  let matchedProduct = cart.find((item) => item.id === productId);

  if (matchedProduct) {
    matchedProduct.quantity += quantity;
  } else {
    cart.push({
      id: productId,
      quantity: quantity,
      deliveryOptionId: "1" // Always include delivery option
    });
  }
  saveToStorage();
}

export function removeProductFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId); // 🔹 Fixed condition
  saveToStorage();
  console.log(cart);
}

export function updateProductQuantity(productId, quantity) {
  let matchedProduct = cart.find((item) => item.id === productId);

  if (matchedProduct) {
    matchedProduct.quantity = quantity;
  }
  saveToStorage();
}
export function clearCart() {
  cart = [];
  saveToStorage();
}
