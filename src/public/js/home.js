//ESTA ES LA PARTE DEL CLIENTE
const socket = io();
const log = document.getElementById('log');

const botonEnviar = document.getElementById("enviar");

botonEnviar.addEventListener("click", event => {
   if (event){
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const code = document.getElementById("code").value;
      const price = document.getElementById("price").value;
      const stock = document.getElementById("stock").value;
      const category = document.getElementById("category").value;
      const thumbnail = document.getElementById("thumbnail").value;      
      
      const nuevoProducto = {title, description, code, price, status: "true", stock, category, thumbnail};
      
      socket.emit("message", nuevoProducto);
   }      
})

socket.on("actualizado", productos => {
   console.log(productos)
   if (productos === "campos"){
      Swal.fire('Todos los campos son obligatorios')
   }
   if(productos === "code"){
      Swal.fire("El 'code' del producto ya existe, intente cambiarlo.")
   }  
   if (productos === "inexistente") {
      Swal.fire("El producto que quiere eliminar no existe")
   } 
   else{
   let inicio = document.getElementById("inicio");
   inicio.style.display = "none";
   let listaProductos = document.getElementById("productos");
   listaProductos.innerHTML = "";    
   productos.forEach(producto => {
     let p = document.createElement("p");
     p.innerText = `id: ${producto._id}, title: ${producto.title}, description: ${producto.description},code: ${producto.code} ,price: ${producto.price}, status: ${producto.status}, stock: ${producto.stock}, category: ${producto.category}, thumbnail: ${producto.thumbnail}`;
     listaProductos.appendChild(p);
   });
 }
});
 
 botonEliminar = document.getElementById("eliminar");
 botonEliminar.addEventListener("click", event => {
   if (event){
      const id =  document.getElementById("id").value;
      socket.emit("message1", id);
   }
})
 




