const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const response = await fetch("/api/sessions/register", {
    method: "POST",
    body: data,
  });
  if (response.ok) {
    const json = await response.json();
    console.log(json);
    Swal.fire({
      title: "El registro se realizo con exito",
      icon: "success",
      html: "Ya podes ingresar desde " + '<a href="/">acá</a>',
    });
  } else {
    console.error("Error en la solicitud de registro");
    Swal.fire("Hubo un error en el registro. Por favor intentelo nuevamente.");
  }
});
