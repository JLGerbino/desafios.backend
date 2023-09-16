const purchaseButton = document.getElementById("purchaseButton");
const clearButton = document.getElementById("clearCartButton");
const deleteProductButtons = document.querySelectorAll(".delete-product");
const carroId = purchaseButton.dataset.cartId;

deleteProductButtons.forEach(eliminar => {
  eliminar.addEventListener("click", async () => {    
    const productoId = eliminar.dataset.productId;    
    try {
      const response = await fetch(`/api/carts/${carroId}/products/${productoId}`, {
        method: "DELETE",
      });      
      if (response.ok) {
        console.log("El producto se elimino con exito.");
        location.reload();
      } else {
        console.error("Error al intentar eliminar el producto.");
      }
    } catch (error) {
      console.error("Error en la peticion de eliminacion del producto.", error);
    }
  });
});

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

purchaseButton.addEventListener("click", async () => {  
  try {    
    const response = await fetch(`/api/carts/${carroId}/purchase`, {
      method: "POST",
    });    
    console.log("fetc fetch fetch",response);
    if (!response.ok) {
      Swal.fire({
        title: "Compra exitosa",
        text: "Le enviamos un email con el detalle de la compra.",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then(() => {        
        window.location.reload()
      });      
    } else {      
      console.error("Error al realizar la compra");
    }
  } catch (error) {    
    console.error("Error en la solicitud de compra", error);
  }
});

