export let cart = JSON.parse(localStorage.getItem('cart')) || [
  {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2
  },
  {
    id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1
  }
];

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addProductToCart(productId, quantity = 1) {
  let matchedProduct = cart.find((item) => item.id === productId);

  if (matchedProduct) {
    matchedProduct.quantity += quantity;
  } else {
    cart.push({
      id: productId, // 🔹 Fixed: `id` instead of `productId`
      quantity: quantity
    });
  }
  console.log(cart);
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
