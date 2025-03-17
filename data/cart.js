export const cart = [
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1
  }
]
//this is the cart array that will store the products that the user adds to the cart and export it so it can be used in other files
//we have used modules to keep the cart array private and only accessible to the files that import it
//we have used export to make the cart array accessible to other files
export function addProductToCart(productId) {
  let matched;
  cart.forEach((cartItem) => {
    if (product.id === productId) {
      matched = cartItem;
    }
  });
  if (matched) {
    matched.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1,
    });
  }
}
