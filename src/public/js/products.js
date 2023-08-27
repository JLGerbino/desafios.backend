const agregarBotones = document.querySelectorAll(".agregar-button");
//const carroId = cartId.getAttribute("data-cart-id");//cartId.dataset.carroId

agregarBotones.forEach(agregar => {
  agregar.addEventListener("click", async () => {
    const carroId = document.getElementById("cartId").textContent;
    const productoId = agregar.dataset.productId;    
    try {
      const response = await fetch(`/api/carts/${carroId}/products/${productoId}`, {
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
});


