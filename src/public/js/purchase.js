const purchaseButton = document.getElementById("purchaseButton");
const clearButton = document.getElementById("clearCartButton");
const deleteProductButtons = document.querySelectorAll(".delete-product");
const carroId = purchaseButton.dataset.cartId;

deleteProductButtons.forEach(eliminar => {
  eliminar.addEventListener("click", async () => {
    //const carroId = document.getElementById("cartId").textContent;//ver como se esta tomado el id del carrito
    const productoId = eliminar.dataset.productId;    
    try {
      const response = await fetch(`/api/carts/${carroId}/products/${productoId}`, {//arreglar la ruta
        method: "DELETE",
      });      
      if (response.ok) {
        console.log("El producto se elimino con exito.");//cambiar textos y probar
        location.reload();
      } else {
        console.error("Error al intentar eliminar el producto.");
      }
    } catch (error) {
      console.error("Error en la peticion de eliminacion del producto.", error);
    }
  });
});

//limpia el carrito
clearButton.addEventListener("click", async () => {  
  try {    
    const response = await fetch(`/api/carts/${carroId}`, {
      method: "DELETE",
    });    
    if (response.ok) {      
      console.log("Los productos se eliminaron con exito");
      location.reload();
    } else {      
      console.error("Error al eliminar todos los productos");
    }
  } catch (error) {    
    console.error("Error en la solicitud de eliminar todos los productos del carrito", error);
  }
});

//finaliza compra
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