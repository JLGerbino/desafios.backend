document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const resetPasswordButton = document.getElementById("resetPasswordButton");

form.addEventListener("submit", e =>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key) => obj[key]=value)
    fetch("/api/sessions",{
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result=>{
        if(result.status == 200){
            window.location.replace("/products")
        }else{
          Swal.fire("Alguno de los datos ingresados es incorrecto")
        }
    })
})

resetPasswordButton.addEventListener("click", async () => {
    const email = document.getElementById("email").value; 
    try {      
      const response = await fetch("api/sessions/forgot-password", {        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), 
      });
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Correo enviado",
          text: "Se ha enviado un correo electrónico para restablecer tu contraseña.",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ha ocurrido un error al enviar el correo de restablecimiento de contraseña.",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ha ocurrido un error al enviar el correo de restablecimiento de contraseña.",
        confirmButtonText: "Ok",
      });
    }
  });
});

