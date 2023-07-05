const purchaseButton = document.getElementById("purchaseButton");
const carroId = purchaseButton.dataset.cartId;
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


