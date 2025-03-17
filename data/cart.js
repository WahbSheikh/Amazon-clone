export const cart = []
//this is the cart array that will store the products that the user adds to the cart and export it so it can be used in other files
//we have used modules to keep the cart array private and only accessible to the files that import it
//we have used export to make the cart array accessible to other files
export function addProductToCart(productId, productName) {
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
      name: productName,
      quantity: 1,
    });
  }
}
