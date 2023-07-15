const purchaseButton = document.getElementById("purchaseButton");
const carroId = purchaseButton.dataset.cartId;

//agregue
// const deleteButtons = document.querySelectorAll(".btn-delete-product");
// deleteButtons.forEach((button) => {
//   button.addEventListener("click", async () => {
//     const productId = button.dataset.productId;
//     try {
//       const response = await fetch(`/api/carts/${carroId}/products/${productId}`, {
//         method: "DELETE",
//       });
//       console.log("id producto purchasejs", productId)
//       if (response.ok) {
//         console.log("Producto eliminado del carrito");
//         // Aquí puedes actualizar la vista del carrito si es necesario
//       } else {
//         console.error("Error al eliminar el producto del carrito");
//       }
//     } catch (error) {
//       console.error("Error en la solicitud de eliminación del producto", error);
//     }
//   });
// });//hasta aca


purchaseButton.addEventListener("click", async () => {  
  try {    
    const response = await fetch(`/api/carts/${carroId}/purchase`, {
      method: "POST",
    });    
    if (response.ok) {      
      console.log("Compra exitosa");
    } else {      
      console.error("Error al realizar la compra");
    }
  } catch (error) {    
    console.error("Error en la solicitud de compra", error);
  }
});


