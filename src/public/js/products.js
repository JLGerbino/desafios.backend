const agregarBotones = document.querySelectorAll(".agregar-button");

agregarBotones.forEach(agregar => {
  agregar.addEventListener("click", async () => {
    const carroId = document.getElementById("carritoId").textContent;    
    const productoId = agregar.dataset.productId;      
    try {
      const response = await fetch(`/api/carts/${carroId}/products/${productoId}`, {
        method: "POST",
      });      
      if (response.ok) {
        console.log("Compra exitosa");
        Swal.fire("El producto se agregó al carrito")
      } else {
        console.error("Error al realizar la compra");
      }
    } catch (error) {
      console.error("Error en la solicitud de compra", error);
    }
  });
});


