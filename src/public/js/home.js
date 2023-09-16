const socket = io();
const newrole = window.role;
const user = window.owner;
console.log("front", newrole);
console.log("front", owner);

document.addEventListener("DOMContentLoaded", function () {
  const log = document.getElementById("log");
  const botonEnviar = document.getElementById("enviar");
  const productForm = document.getElementById("productForm");

  if (productForm) {
    productForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const code = document.getElementById("code").value;
      const price = document.getElementById("price").value;
      const stock = document.getElementById("stock").value;
      const category = document.getElementById("category").value;
      const thumbnailInput = document.getElementById("thumbnail");

      const nuevoOwner = newrole === "premium" ? user : "admin";

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("code", code);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("thumbnail", thumbnailInput.files[0]);
      formData.append("owner", nuevoOwner);

      try {
        const response = await fetch("/api/products", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          Swal.fire("El producto se cargo con exito");
          window.location.reload();
        } else {
          Swal.fire(
            "Error",
            "Todos los campos son obligatorios y el código no puede repetirse",
            "error"
          );
          console.error("Error al agregar el producto.");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    });
  }
});

socket.on("actualizado", (productos) => {
  console.log(productos);
  if (productos === "campos") {
    Swal.fire("Todos los campos son obligatorios");
  }
  if (productos === "code") {
    Swal.fire("El 'code' del producto ya existe, intente cambiarlo.");
  }
  if (productos === "inexistente") {
    Swal.fire("El producto que quiere eliminar no existe");
  } else {
    let inicio = document.getElementById("inicio");
    inicio.style.display = "none";
    let listaProductos = document.getElementById("productos");
    listaProductos.innerHTML = "";
    productos.forEach((producto) => {
      let p = document.createElement("p");
      p.innerText = `id: ${producto._id}, title: ${producto.title}, description: ${producto.description},code: ${producto.code} ,price: ${producto.price}, status: ${producto.status}, stock: ${producto.stock}, category: ${producto.category}, owner:${producto.owner}, thumbnail: ${producto.thumbnail}`;
      listaProductos.appendChild(p);
    });
  }
});
socket.on("alert", (message) => {
  Swal.fire(message);
});

const botonEliminar = document.getElementById("eliminar");
botonEliminar.addEventListener("click", (event) => {
  if (event) {
    const id = document.getElementById("id").value;
    const data = {
      id: id,
      user: user,
      role: newrole,
    };
    socket.emit("message1", data);
  }
});
